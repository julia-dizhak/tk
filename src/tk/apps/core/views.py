from django.shortcuts import render


def index(request, task_id=None):
    return render(request, 'index.html', {})