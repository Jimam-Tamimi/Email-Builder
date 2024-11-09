from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from uuid import uuid4

from account.models import Profile
from builder.models import Template

class UserConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
 
        self.user_id = self.scope['url_route']['kwargs'].get('user_id')

        try: 
            self.profile = await database_sync_to_async(Profile.objects.get)(user=self.user_id)
 
            await self.accept()
            self.profile.active_channel_name = self.channel_name
            await database_sync_to_async(self.profile.save)()

        except Profile.DoesNotExist:
            await self.close()
            return

    async def disconnect(self, close_code):
        # Set the active_status to False (indicating the user is no longer active)
        try:
            self.profile.active_channel_name = None
            await database_sync_to_async(self.profile.save)()

        except Profile.DoesNotExist:
            pass
        
        
    async def receive_json(self, content):
        template_id = content.get('templateId', None)
        if content.get('type') == "update_template_data" and self.profile.active_channel_name and template_id:
            response = await self.update_template_data(template_id, content.get('templateData'))
            print(response)
            await self.send_json(response)

    @database_sync_to_async
    def update_template_data(self, template_id, data):
        try:
            template = Template.objects.get(id=template_id)
            print(template.creator)
            print(self.profile.user)
            print(self.scope["user"])
            if template.creator == self.profile.user :
                if data:
                    template.data = data
                    template.save()
                    return {'success': 'Template updated successfully.'}
                else:
                    return {'error': 'Data is required to update the template.'}
            else:
                return {'error': 'You do not have permission to update this template.'}
        except Template.DoesNotExist:
            return {'error': 'Template not found.'}