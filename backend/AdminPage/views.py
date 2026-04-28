from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse

from .models import Distro

def get_distros(request):
    distros =  Distro.objects.all().order_by('-created_at')
    distros_data = []
    for  distro  in  distros:
        distros_data.append({
            'id': distro.id,
            'name': distro.name,
            'description': distro.description,
            'website':  distro.website,
            'created_at':  distro.created_at.isoformat(),
        })
    
    return JsonResponse({'distros':  distros_data})

def index(request):
    if request.method == 'POST' and request.POST.get('delete_id'):
        delete_id = request.POST.get('delete_id')
        try:
            d = Distro.objects.get(pk=delete_id)
            d.delete()
            messages.success(request, f'Distro "{d.name}" deleted.')
        except Distro.DoesNotExist:
            messages.error(request, 'Distro not found.')
        return redirect('index')

    distros = Distro.objects.all().order_by('-created_at')
    context = {
        'distros': distros,
    }
    return render(request, 'pages/admin_page.html', context)


def add_distro(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        description = request.POST.get('description', '').strip()
        website = request.POST.get('website', '').strip() or None

        if not name:
            messages.error(request, 'Name is required to add a distro.')
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'ok': False, 'error': 'Name is required'}, status=400)
            return redirect('index')

        distro = Distro.objects.create(name=name, description=description, website=website)
        messages.success(request, f'Distro "{distro.name}" created.')
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({
                'ok': True,
                'distro': {
                    'id': distro.id,
                    'name': distro.name,
                    'description': distro.description,
                    'website': distro.website,
                    'created_at': distro.created_at.isoformat(),
                }
            })
        return redirect('index')

    return redirect('index')


def list_distros(request):
    distros = Distro.objects.all().order_by('-created_at')
    data = []
    for d in distros:
        data.append({
            'id': d.id,
            'name': d.name,
            'description': d.description,
            'website': d.website,
            'created_at': d.created_at.isoformat(),
        })
    
    return JsonResponse({'distros': data})

