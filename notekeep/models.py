from django.db import models
from django.utils import timezone

class Notes(models.Model):
	Title = models.CharField(max_length=200)
	Tagline = models.CharField(max_length=250)
	Body = models.TextField()
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
	pinned = models.BooleanField()

	class Meta:
		ordering = ('-created', )
		verbose_name = 'Notes'
		verbose_name_plural = 'Notes'

	def __str__(self):
		return self.Title