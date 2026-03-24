from django import forms
from .models import Asset


class AssetForm(forms.ModelForm):
    class Meta:
        model = Asset
        fields = ['title', 'file']

    def clean_file(self):
        file = self.cleaned_data.get('file')

        if file:
            if not file.name.endswith(('.glb', '.gltf')):
                raise forms.ValidationError('Только .glb и .gltf файлы разрешены')

        return file