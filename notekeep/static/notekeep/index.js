$(document).ready(function() {

	// this is for those notes which is not pinned yet
	$('.unpin-img').live('click', function(e) {
		e.preventDefault();
		$.post('http://localhost:8000/pinNote/',
			{
				id: $(this).data('id'),
				action: $(this).data('action')
			},
			function(data) {
				if (data.status == 'ok') {
					var currentPage = $('#currPage').attr('data-currpage')
					$(".view-modal").addClass('d-none');
					loadpinnednotes(reload=true);
					loadnotes(currentPage, true);
				}
				else {
					alert('request declined');
				}
			}
		);
	});

	// this is for those notes which is already pinned
	$('.pin-img').live('click', function(e) {
		e.preventDefault();
		$.post('http://localhost:8000/pinNote/',
			{
				id: $(this).data('id'),
				action: $(this).data('action')
			},
			function(data) {
				if (data.status == 'ok') {
					$(".view-modal").addClass('d-none');
					var currentPage = $('#currPage').attr('data-currpage')
					loadpinnednotes(reload=true);
					loadnotes(currentPage, true);
				}
				else {
					alert('request declined');
				}
			}
		);
	});

	$(".cross").live('click', function() {
		$('#title').val('');
   		$('#tagline').val('');
   		$('#body').val('');
   		$('#pin').attr('checked', false);
   		$('.sbt-btn').removeAttr('data-id');
		$(".view-modal").addClass('d-none');
	});

	$(".item").live('click', function() {
		id = $(this).data('pk');
		loadrequestedNote(id);
		$(".view-modal").removeClass('d-none');
	});

	$(".add-new").live('click', function() {
		$(".view-modal").removeClass('d-none');
	});

	loadpinnednotes();
	loadnotes(1);

	$('#prevPage, #prevBtn').live('click', function() {
		currpage = $('#currPage').attr('data-currpage');
		prevpage = $('#prevPage').attr('data-prevpage');
		loadnotes(prevpage);
		$(`#page${currpage}`).remove();
	});
	
	$('#nextPage, #nextBtn').live('click', function() {
		currpage = $('#currPage').attr('data-currpage');
		nextpage = $('#nextPage').attr('data-nextpage');
		loadnotes(nextpage);
		$(`#page${currpage}`).remove();
	});

	$('.sbt-btn').live('click', function() {
		saveNotes();
	});
});


function loadrequestedNote(id) {
	$.ajax({
	   type: 'GET',
	   url:`http://localhost:8000/requestNote/${id}/`,
	   success: function(data, textStatus, request) {
	   		$('.sbt-btn').attr('data-id', data[0].pk);
	   		$('#title').val(data[0].fields.Title);
	   		$('#tagline').val(data[0].fields.Tagline);
	   		$('#body').val(data[0].fields.Body);
	   		$('#pin').attr('checked', data[0].fields.pinned);
	   		// alert('worked');
	   },
	   error: function (request, textStatus, errorThrown) {
	        alert('do something');
	   }
    });
}

function loadnotes(page, reload=false) {
	if (reload == true) {
		$(`#page${page}`).remove();
	}
	$.ajax({
	   type: 'GET',
	   url:`http://localhost:8000/notes/?page=${page}`,
	   success: function(data, textStatus, request) {
	        var header = request.getResponseHeader('pageinfo');
	        pagedata = $.parseJSON(header);
	        var notesItem = '';
	        for (i=0;i<data.length;i++) {
	        	var temp = `<div class="item" data-pk="${data[i].pk}">
									<img height="35px" width="35px" src="${documentImg}">
									<span>${data[i].fields.Title}</span>
									<img title="pin it" data-id="${data[i].pk}" data-action="pinit" class="unpin-img" src="${unpinImg}">
								</div>`;
				notesItem = notesItem.concat(temp);
    		}
    		var notes = `<div id="page${pagedata.currentpage}" class="notes">
    						${notesItem}
    					</div>`;
			$(notes).insertBefore('.pagination');
			$('#currPage').html(page);
			$('#currPage').attr("data-currpage", `${page}`);
			if (pagedata.haspreviouspage == true) {
				$('#prevPage').html(parseInt(page)-1);
				$('#prevPage').removeClass('d-none');
				$('#prevBtn').removeClass('deactive-pageBtn');
				// $('#prevPage, #prevBtn').live('click', function() {
				// 	$(`#page${page}`).addClass('d-none');
				// 	console.log(page-1);
				// 	loadpage(page-1);
				// });
				$('#prevPage, #prevBtn').attr("data-prevpage", parseInt(page)-1);
			}
			if (pagedata.haspreviouspage == false) {
				$('#prevPage').addClass('d-none');
				$('#prevBtn').addClass('deactive-pageBtn');
				// $('#prevPage, #prevBtn').click(function() { return false; });
			}
			if (pagedata.hasnextpage == false) {
				$('#nextPage').addClass('d-none');
				$('#nextBtn').addClass('deactive-pageBtn');
				// $('#nextPage, #nextBtn').click(function() { return false; });
			}
			if (pagedata.hasnextpage == true) {
				$('#nextPage').html(parseInt(page)+1);
				$('#nextPage').removeClass('d-none');
				$('#nextBtn').removeClass('deactive-pageBtn');
				// $('#nextPage, #nextBtn').live('click', function() {
				// 	$(`#page${page}`).addClass('d-none');
				// 	console.log(page+1);
				// 	loadpage(page+1);
				// });
				$('#nextPage, #nextBtn').attr("data-nextpage", parseInt(page)+1);
			}
	   },
	   error: function (request, textStatus, errorThrown) {
	   		$('.notification').addClass('d-none');
	        $('.notification').removeClass('d-none');
			$('.notification-title').html('something went wrong please try again later.');
	   }
    });
}

function loadpinnednotes(reload=false) {
	if (reload==true) {
		$('#pinned-notes').remove()
	}
	$.ajax({
	   type: 'GET',
	   url:`http://localhost:8000/pinnednotes/`,
	   success: function(data, textStatus, request) {
	        var notesItem = '';
	        for (i=0;i<data.length;i++) {
	        	var temp = `<div class="item" data-pk="${data[i].pk}">
									<img height="35px" width="35px" src="${documentImg}">
									<span>${data[i].fields.Title}</span>
									<img height="16px" width="16px" title="unpin it" data-id="${data[i].pk}" data-action="unpinit" class="pin-img" src="${pinImg}">
								</div>`;
				notesItem = notesItem.concat(temp);
    		}
    		var notes = `<div id="pinned-notes" class="notes">
    						${notesItem}
    					</div>`;
			$('.pinned').append(notes);
	   },
	   error: function (request, textStatus, errorThrown) {
	   		$('.notification').addClass('d-none');
	        $('.notification').removeClass('d-none');
			$('.notification-title').html('something went wrong please try again later.');
	   }
    });
}

function saveNotes() {
	$.post('http://localhost:8000/saveNote/',
			{
				id: $('.sbt-btn').attr('data-id'),
				title: $('#title').val(),
				tagline: $('#tagline').val(),
				body: $('#body').val(),
				pin: $('#pin').attr('checked')
			},
			function(data) {
				if (data.status == 'ok') {
					console.log(data.status);
					var currentPage = $('#currPage').attr('data-currpage')
					loadpinnednotes(reload=true);
					loadnotes(currentPage, reload=true);
					if (data.id) {
						$('.sbt-btn').attr('data-id', data.id);
					}
				}
				else {
					$('.notification').removeClass('d-none');
					$('.notification-title').html('something went wrong please try again later.');
				}
			}
		);
}