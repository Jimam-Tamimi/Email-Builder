# Generated by Django 5.1.3 on 2024-11-08 18:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('builder', '0002_alter_template_data'),
    ]

    operations = [
        migrations.AlterField(
            model_name='template',
            name='description',
            field=models.TextField(blank=True, null=True, verbose_name='Description'),
        ),
    ]
