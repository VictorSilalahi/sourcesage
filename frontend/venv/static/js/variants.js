$(document).ready(function()
{
	alert("test");
	
	showData("variants");

    $("#tblVariants tbody").html("");

	$('.input-variants-images').imageUploader();

	$(".btn-add-variants").on("click", function() {
		$("#modAdd").modal("show");
	});

	$(".btn-save-new-variants").on('click',function()
	{
		if ($('#frmNewVariants #txtVariantName').val()=='')
		{
			alert('Input variant name!');
			$('#frmNewVariants #txtVariantName').focus();
			return false;
		}

		if ($('#frmNewVariants #txtVariantSize').val()=='')
		{
			alert('Input size!');
			$('#frmNewVariants #txtVariantSize').focus();
			return false;
		}

		var fileElement = $("[name='images[]']");
      	var filesCount = $(fileElement[0]).prop('files').length;
		if (filesCount==0)
		{
			alert("Choose image files for variants!");
			$("[name='images[]']").focus();
			return false;
		}
	  
		var formData = new FormData();
		formData.append('txtProductID', $("#frmNewVariants #slcProductChoose").val());
		formData.append('txtVariantName', $("#frmNewVariants #txtVariantName").val());
		formData.append('txtVariantSize', $("#frmNewVariants #txtVariantSize").val());
		formData.append('txtVariantColor', $("#frmNewVariants #slcColor").val());
		for (var index = 0; index < filesCount; index++) {
			formData.append('images[]', $("[name='images[]']")[0].files[index]);
	 	}

		$.ajax({
			url : "http://127.0.0.1:6100/v1/variants/addvariant",
			type : 'POST',
			data : formData,
			async: false,
			processData: false,  // tell jQuery not to process the data
			contentType: false,  // tell jQuery not to set contentType
			success : function(data) {
				if (data["msg"]=="ok")
				{
                    if ($("#slcProduct").val()==$("#slcProductChoose").val())
                    {
                        showVariants($("#slcProduct").val());
                    }
					$("#frmNewVariants #txtVariantName").val("");
					$("#frmNewVariants #txtVariantSize").val("");
					$("#modAdd").modal("hide");
					
				}
			}
		});
	});

    $(".btn-show-variants").on("click", function() {
        showVariants($("#slcProduct").val());
    });
});

$(document).on("click",".btn-del", function() {
	conf = confirm("Are you sure to delete this variant data?");
	if (conf==true)
	{
		var vid = $(this).parent().parent().attr("id");
		$.ajax({
			url: "http://127.0.0.1:6100/v1/variants/delvariant/"+vid
		}).then(function(data) {
			if (data["msg"]=="ok")
			{
				showVariants($("#slcProduct").val());
			}
		});

	}
});

$(document).on("click",".btn-show-images", function() {
	var vid = $(this).parent().parent().attr("id");
	$.ajax({
		url: "http://127.0.0.1:6100/v1/variants/getimages/"+vid
	}).then(function(data) {
		if (data["msg"]=="ok")
		{
			console.log(data["data"]);
			var str='';
            d = data["data"];
            for (var i=0; i<d.length; i++)
            {
                str=str+"<a target='_blank' href=''><img src='http://127.0.0.1:6100/v1/variants/showimage/"+d[i]['path']+"' alt=''></a>";
            }
            $("#modImages .bodyimg").html(str);
            $("#modImages").modal("show");
		}
	});

});


$(document).on("click",".btn-edit", function() {
	var vid = $(this).parent().parent().attr("id");
    $("#frmEditVariant #txtVariantsID").val(vid);
	$.ajax({
		url: "http://127.0.0.1:6100/v1/variants/getparticularvariant/"+vid
	}).then(function(data) {
		if (data["msg"]=="ok")
		{
			d = data["data"];
            console.log(d);
			$("#frmEditVariant #slcProductChoose").val(d[0]["productid"]);
			$("#frmEditVariant #txtVariantName").val(d[1]["name"]);
			$("#frmEditVariant #txtVariantSize").val(d[2]["size"]);
            $("#frmEditVariant #slcColor").val(d[3]["color"]);
			$("#modEdit").modal("show");
		}
	});

});


$(document).on("click",".btn-save-productchoose", function() {

	var formData = new FormData();
	formData.append('pid', $("#frmEditVariant #slcProductChoose").val());
	formData.append('vid', $("#frmEditVariant #txtVariantsID").val());

	$.ajax({
		url : "http://127.0.0.1:6100/v1/variants/updatevariantproduct",
		type : 'POST',
		data : formData,
		async: false,
		processData: false,  // tell jQuery not to process the data
		contentType: false,  // tell jQuery not to set contentType
		success : function(data) {
			console.log(data);
			if (data["msg"]=="ok")
			{
				location.reload();
			}
		}
	});

});

$(document).on("click",".btn-save-variantsize", function() {

	var formData = new FormData();
	formData.append('size', $("#frmEditVariant #txtVariantSize").val());
	formData.append('vid', $("#frmEditVariant #txtVariantsID").val());

	$.ajax({
		url : "http://127.0.0.1:6100/v1/variants/updatevariantsize",
		type : 'POST',
		data : formData,
		async: false,
		processData: false,  // tell jQuery not to process the data
		contentType: false,  // tell jQuery not to set contentType
		success : function(data) {
			console.log(data);
			if (data["msg"]=="ok")
			{
				location.reload();
			}
		}
	});

});

$(document).on("click",".btn-save-variantname", function() {

	var formData = new FormData();
	formData.append('name', $("#frmEditVariant #txtVariantName").val());
	formData.append('vid', $("#frmEditVariant #txtVariantsID").val());

	$.ajax({
		url : "http://127.0.0.1:6100/v1/variants/updatevariantname",
		type : 'POST',
		data : formData,
		async: false,
		processData: false,  // tell jQuery not to process the data
		contentType: false,  // tell jQuery not to set contentType
		success : function(data) {
			console.log(data);
			if (data["msg"]=="ok")
			{
				location.reload();
			}
		}
	});

});

$(document).on("click",".btn-save-variantcolor", function() {

	var formData = new FormData();
	formData.append('color', $("#frmEditVariant #slcColor").val());
	formData.append('vid', $("#frmEditVariant #txtVariantsID").val());

	$.ajax({
		url : "http://127.0.0.1:6100/v1/variants/updatevariantcolor",
		type : 'POST',
		data : formData,
		async: false,
		processData: false,  // tell jQuery not to process the data
		contentType: false,  // tell jQuery not to set contentType
		success : function(data) {
			console.log(data);
			if (data["msg"]=="ok")
			{
				location.reload();
			}
		}
	});

});

$(document).on("click",".btn-save-productname", function() {
	if ($("#frmEditProduct #txtProductName").val()=='')
	{
		alert("insert new product name");
		$("#frmEditProduct #txtProductName").focus();
		return false;
	}

	var formData = new FormData();
	formData.append('pid', $("#frmEditProduct #txtProductID").val());
	formData.append('pname', $("#frmEditProduct #txtProductName").val());

	var pid = $("#frmEditProduct #txtProductID").val();

	$.ajax({
		url : "http://127.0.0.1:6100/v1/products/updateproductname",
		type : 'POST',
		data : formData,
		async: false,
		processData: false,  // tell jQuery not to process the data
		contentType: false,  // tell jQuery not to set contentType
		success : function(data) {
			console.log(data);
			if (data["msg"]=="ok")
			{
				location.reload();
			}
		}
	});

});

function showData(type)
{
	var uri="products/all"
	if (type=="products")
	{
		$("#tblProducts tbody").html("");
	}

    $.ajax({
		url: "http://127.0.0.1:6100/v1/"+uri
	}).then(function(data) {
		if (data["msg"]=="ok")
		{
			//console.log(data["data"]);
			datatemp = data["data"];
			var str='';
			var no=1;
			if (type=="products")
			{
				for (var i=0; i<datatemp.length; i++)
				{
					str=str+"<tr id='"+datatemp[i]['productid']+"'><td>"+no+"</td><td>"+datatemp[i]['name']+"</td>";
					str=str+"<td><img width='50px' height='50px' src='http://127.0.0.1:6100/static/data/images/logo/"+datatemp[i]['path']+"'></td>";
					str=str+"<td>"+datatemp[i]['descr']+"</td><td>"+datatemp[i]['created_at']+"</td><td>"+datatemp[i]['update_at']+"</td><td><button class='btn btn-info btn-edit'>Edit</button>&nbsp;<button class='btn btn-warning btn-del'>Del</button></tr>";
					no++;
				}
				$("#tblProducts tbody").append(str);
			}
			else
			{
                for (var i=0; i<datatemp.length; i++)
                {
                    $("#slcProduct").prepend("<option value='"+datatemp[i]['productid']+"'>"+datatemp[i]['name']+"</option>");
					$("#frmNewVariants #slcProductToChoose").prepend("<option value='"+datatemp[i]['productid']+"'>"+datatemp[i]['name']+"</option>");
                    $("#frmEditVariant #slcProductChoose").prepend("<option value='"+datatemp[i]['productid']+"'>"+datatemp[i]['name']+"</option>");
                }
			}
		}
	});
}

function showVariants(productid)
{
	var uri="variants/getvariant/"+productid;

    $("#tblVariants tbody").html("");

    $.ajax({
		url: "http://127.0.0.1:6100/v1/"+uri
	}).then(function(data) {
		if (data["msg"]=="ok")
		{
			//console.log(data["data"]);
			datatemp = data["data"];
			var str='';
			var no=1;
			for (var i=0; i<datatemp.length; i++)
			{
				str=str+"<tr id='"+datatemp[i]['variantid']+"'><td>"+no+"</td><td>"+datatemp[i]['name']+"</td>";
				str=str+"<td>"+datatemp[i]['size']+"</td>"+"<td>"+datatemp[i]['color']+"</td>";
				str=str+"</td><td>"+datatemp[i]['created_at']+"</td><td>"+datatemp[i]['updated_at']+"</td><td><button class='btn btn-danger btn-show-images'>Images</button>&nbsp;<button class='btn btn-info btn-edit'>Edit</button>&nbsp;<button class='btn btn-warning btn-del'>Del</button></tr>";
				no++;
			}
			$("#tblVariants tbody").append(str);
		}
	});
}