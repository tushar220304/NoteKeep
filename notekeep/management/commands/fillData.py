from django.core.management.base import BaseCommand
from django.utils.crypto import get_random_string
from notekeep.models import Notes

class Command(BaseCommand):
	help = 'It will generate the data for random notes'

	def add_arguments(self, parser):
		parser.add_argument('total', type=int, help='Indicates the number of notes to be created')

	def handle(self, *args, **kwargs):
		total = kwargs['total']
		try :
			for i in range(total):
				notes = Notes(Title=get_random_string(length=15, allowed_chars='tushar Kumar'),
							 Tagline=get_random_string(length=20, allowed_chars='this is tagline'),
							 Body=get_random_string(length=150),
							 pinned=get_random_string(length=1, allowed_chars='01'))
				notes.save()
				self.stdout.write(self.style.SUCCESS(f'Notes {notes.Title} created with success!'))
		except:
			self.stdout.write(self.style.WARNING(f'Note not created'))