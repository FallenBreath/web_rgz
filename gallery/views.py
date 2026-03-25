from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.contrib import messages
from .models import Asset
from .forms import AssetForm


def home(request):
    assets = Asset.objects.all()

    search_query = request.GET.get('q', '')
    sort_option = request.GET.get('sort', 'new')
    type_filter = request.GET.get('type', 'all')

    if search_query:
        assets = assets.filter(title__icontains=search_query)

    if type_filter == 'glb':
        assets = assets.filter(file__iendswith='.glb')
    elif type_filter == 'gltf':
        assets = assets.filter(file__iendswith='.gltf')

    if sort_option == 'old':
        assets = assets.order_by('created_at')
    elif sort_option == 'name':
        assets = assets.order_by('title')
    else:
        assets = assets.order_by('-created_at')

    paginator = Paginator(assets, 6)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'assets': page_obj,
        'page_obj': page_obj,
        'search_query': search_query,
        'sort_option': sort_option,
        'type_filter': type_filter,
    }
    return render(request, 'index.html', context)


def upload_model(request):
    if request.method == 'POST':
        form = AssetForm(request.POST, request.FILES)
        if form.is_valid():
            asset = form.save()
            messages.success(request, f'Модель "{asset.title}" успешно загружена.')
            return redirect('home')
    else:
        form = AssetForm()

    return render(request, 'upload.html', {'form': form})

def asset_detail(request, asset_id):
    asset = get_object_or_404(Asset, id=asset_id)
    return render(request, 'asset_detail.html', {'asset': asset})