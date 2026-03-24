from django.db import models


class Asset(models.Model):
    title = models.CharField(max_length=200, verbose_name='Название')
    file = models.FileField(upload_to='models/', verbose_name='3D-файл')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата загрузки')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = '3D-модель'
        verbose_name_plural = '3D-модели'
        ordering = ['-created_at']