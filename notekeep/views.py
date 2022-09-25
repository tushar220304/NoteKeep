from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.core import serializers
from django.views.decorators.http import require_POST
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Notes
import json

def index(request):
	return render(request, 'notekeep/index.html')

def notes(request):
	notes = Notes.objects.filter(pinned=False).only('id', 'Title', 'Tagline', 'Body', 'updated', 'pinned').order_by('-updated')
	paginator = Paginator(notes, 6)
	page = request.GET.get('page')
	try:
		notes_page = paginator.page(page)
		notes_json = serializers.serialize('json', notes_page)
		pageInfo = {'totalresult': paginator.count,
					'totalpages': paginator.num_pages,
					'currentpage': notes_page.number,
					'hasnextpage': notes_page.has_next(),
					'haspreviouspage': notes_page.has_previous()}
		response = HttpResponse(notes_json, content_type="text/json-comment-filtered")
		response['pageinfo'] = json.dumps(pageInfo)
		return response
	except EmptyPage:
		return JsonResponse({'page': 'empty'})


def pinnednotes(request):
	notes = Notes.objects.filter(pinned=True).only(
		'id', 'Title', 'Tagline', 
		'Body', 'updated', 'pinned').order_by('-updated')[:6]
	notes_json = serializers.serialize('json', notes)
	return HttpResponse(notes_json, content_type="text/json-comment-filtered")

@require_POST
def pinNote(request):
	note_id = request.POST.get('id')
	action = request.POST.get('action')
	if note_id and action:
		try:
			notes = Notes.objects.get(id=note_id)
			if action == 'pinit':
				notes.pinned = True
				notes.save()
			else :
				notes.pinned = False
				notes.save()
			return JsonResponse({'status': 'ok'})
		except:
			return JsonResponse({'status': 'error'})

@require_POST
def saveNote(request):
	note_id = request.POST.get('id')
	note_title = request.POST.get('title')
	note_tagline = request.POST.get('tagline')
	note_body = request.POST.get('body')
	note_pin = request.POST.get('pin')
	if (request.POST.get('pin') == 'checked'):
		note_pin = True
	else :
		note_pin = False
	if note_id:
		note = Notes.objects.get(id=note_id)
		note.Title = note_title
		note.Tagline = note_tagline
		note.Body = note_body
		note.pinned = note_pin
		note.save()
		return JsonResponse({'status': 'ok'})
	else :
		note = Notes(Title=note_title, Tagline=note_tagline,
					 Body=note_body, pinned=note_pin)
		note.save()
		return JsonResponse({'status': 'ok', 'id': note.id})

def requestNote(request, id):
	notes = Notes.objects.filter(id=id).only('id', 'Title', 'Tagline', 'Body', 'pinned')
	notes_json = serializers.serialize('json', notes)
	return HttpResponse(notes_json, content_type="text/json-comment-filtered")
	return JsonResponse({'data': notes})