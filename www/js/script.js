//start
document.addEventListener("deviceready", onDeviceReady, false);
            
//inicia
function onDeviceReady() {
	//console.log('start');
	//document.addEventListener("hidekeyboard", onHide, false);
	//document.addEventListener("showkeyboard", onShow, false);
}

function onHide() {
	jQuery('input').removeClass('big');
}

function onShow() {
	jQuery('input').focus(function() {
        $(this).addClass("big");
    })
}

jQuery(document).ready(function() {
	
	//configura valores default de inputs
	var input = $('input');
    
    input.each(function(){
       $(this).data('default', $(this).val());
    }).focus(function(){
        if($(this).val() == $(this).data('default')){
            $(this).val(""); 
        }
    }).blur(function(){
        if(!$(this).val()){
            $(this).val($(this).data('default'));
        }
    }); 
});

//terminos
jQuery(document).on('click','form .terminos',function(e){
	jQuery('#terminos').show();
});
jQuery(document).on('click','#terminos',function(e){
	jQuery('#terminos').hide();
});

//enviar
jQuery(document).on('click','form .submit',function(e){
	filled = 1;
	
	//revisa campos requeridos
	jQuery("form input.required").each(function() {
		if(jQuery(this).val() == '' || jQuery(this).val() == jQuery(this).data('default')){
			filled = 0;
			jQuery(this).css({'border':'1px solid #ff0000'});
		}else{
			jQuery(this).css({'border':'1px solid #aaa'});
		}
	});
	
	//graba si los campos están llenos
	if(filled == 1){
		//oculta formulario
		jQuery('form').hide();
	
		//graba en el archivo
		save_form();
		
		//revisa el personaje seleccionado
		d7 = jQuery('form #personaje').find(":selected").attr('class');
		
		console.log(d7);
		
		//agrega la clase del personaje
		jQuery('body').addClass(d7);
		
		//oculta todos los items
		hide_items();
	}
});

function hide_items(){
	jQuery(".swing-1").hide();
	jQuery(".swing-2").hide();
	jQuery(".swing-3").hide();
	jQuery(".swing-4").hide();
	jQuery(".swing-5").hide();
	jQuery("form").hide();
	jQuery("#send").hide();
	jQuery(".volver").show();
}

function show_items(){
	jQuery(".swing-1").show();
	jQuery(".swing-2").show();
	jQuery(".swing-3").show();
	jQuery(".swing-4").show();
	jQuery(".swing-5").show();
	jQuery("form").show();
	jQuery("#send").show();
	jQuery(".volver").hide();
}

//reinicia
jQuery(document).on('click','.volver',function(e){
	//oculta gracias
	show_items()
	
	//remueve la clase del gracias
	jQuery('body').removeClass();
});

//enviar archivo
jQuery(document).on('click','#send',function(e){
	//enviar archivo
	uploadFile('hb_file.txt');
});

//trae los valores del formulario
function get_values(){
	d1 = jQuery('form #nombre').val();
	d2 = jQuery('form #identificacion').val();
	d3 = jQuery('form #mail').val();
	d4 = jQuery('form #telefono').val();
	d5 = jQuery('form #factura').val();
	d6 = jQuery('form #lugar').val();
	d7 = jQuery('form #ciudad').val();
	d8 = jQuery('form #dia').val();
	d9 = jQuery('form #mes').val();
	d10 = jQuery('form #ano').val();
	d11 = jQuery('form #personaje').val();
	
	//borra los datos de los valores
	jQuery("form input").each(function() {
		default_val = jQuery(this).data('default'); 
		jQuery(this).val(default_val);
	});
	
	return d1 + ',' + d2 + ',' + d3 + ',' + d4 + ',' + d5 + ',' + d6 + ',' + d7 + ',' + d8 + ',' + d9 + ',' + d10 + ',' + d11;
}

//graba el formulario
function save_form(){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

//llama al archivo en el sistema
function gotFS(fileSystem) {
	fileSystem.root.getFile("hb_file.txt", {create: true, exclusive: false}, gotFileEntry, fail);
}

//crea una escritura sobre el archivo
function gotFileEntry(fileEntry) {
	fileEntry.createWriter(gotFileWriter, fail);
}

//Escribe en el archivo
function gotFileWriter(writer) {
	var d = new Date();
	writer.seek(writer.length);
	data = get_values();
	writer.write(data + ',' + d.getTime() + "\n");
	writer.onwriteend = function(evt) {
		console.log("Finish");
	};
}

//si todo va ok
function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    alert("Enviado");
    jQuery("#status").html('');
}

//si hay un error
function fail(error) {
	console.log("Error code: " + error.code);
	console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
    alert("Falla" + error.code);
}

//Envia archivo a un servidor
function uploadFile(fileuri) {

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileuri
    options.mimeType = "text/plain";
    options.chunkedMode = false;
    options.headers = {
		Connection: "close"
	};

    var params = new Object();
    params.value1 = device.uuid;

    options.params = params;
    options.chunkedMode = false;
    
    var ft = new FileTransfer();
	
	ft.onprogress = function(progressEvent) {
        if(progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            jQuery("#status").html(perc + "%");
            console.log(perc + "%");
        }/*else{
            if(jQuery("#status").html() == "") {
                jQuery("#status").html("Uploading");
                console.log("Uploading");
            }else{
                jQuery("#status").html(jQuery("#status").html() + ".");
                console.log(jQuery("#status").html() + ".");
            }
        }*/
    };
    
    ft.upload('file:///sdcard/'+fileuri, encodeURI("http://www.hasbrotellevaabrasil.com/webservice/upload.php"), win, fail, options, true);
}

