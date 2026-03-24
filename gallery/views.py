from django.shortcuts import render
from .models import Asset

from .forms import AssetForm
from django.shortcuts import redirect

def home(request):
    assets = Asset.objects.all()
    context = {
        'assets': assets
    }
    return render(request, 'index.html', context)

def upload_model(request):
    if request.method == 'POST':
        form = AssetForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('home')
    else:
        form = AssetForm()

    return render(request, 'upload.html', {'form': form})