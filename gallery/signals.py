from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Asset


@receiver(post_delete, sender=Asset)
def delete_asset_file(sender, instance, **kwargs):
    if instance.file:
        instance.file.delete(save=False)