window.mrk_ect_config = [
	'custom_css': false,
	'page_config': false,
	'timeout': 500,
	'margin_left': 30
];
// also give the ability of declaring custom window object
$(document).ready(function(){
	window.mrk_ect_timer; // create container for tolltip timer
	window.mrk_ect_tooltip_timeout = 500; // tooltip timeout
	window.mrk_ect_css = 
	`
	.mrk_ect_tooltip_box
	{
		z-index: 9999999;
		white-space: pre;
		position: absolute;
		display: flex;
		margin-top: 25px;
		background: var(--blender_tooltip);
		border-radius: var(--bmenu_border_radius);
		border: var(--bmenu_outline);
		color: white;
		font-family: 'blender', sans-serif;
		font-size: 11px;
		padding: 9px;
	}
	`;
	
	if (window.)
});

document.addEventListener('mouseover', event => {
	const cursor_over_tooltip_obj = event.target.closest('*[mrk_ect_tooltip]');
	if (cursor_over_tooltip_obj)
	{
		mrk_ect_timer = setTimeout(function() {
			console.log('delayed call');
			$('.mrk_ect_tooltip_box').css({top: cs_y, left: parseInt(cs_x) - 30 + 'px'});
			$('.mrk_ect_tooltip_box').removeClass('mrk_ect_class_hidden');
			$('.mrk_ect_tooltip_box').text($(cursor_over_tooltip_obj).attr('mrk_ect_tooltip'));
		}, mrk_ect_tooltip_timeout);
	}
});

document.addEventListener('mouseout', event => {
	const cursor_over_tooltip_obj_leave_soon = event.target.closest('*[mrk_ect_tooltip]');
	if (cursor_over_tooltip_obj_leave_soon)
	{
		clearTimeout(mrk_ect_timer);
		$('.mrk_ect_tooltip_box').addClass('mrk_ect_class_hidden');
	}
});

// pootis
document.addEventListener('mousemove', function (e) {
    var x = e.clientX;
    var y = e.clientY;
    window.cs_x = x + "px";
    window.cs_y = y + "px";
});

