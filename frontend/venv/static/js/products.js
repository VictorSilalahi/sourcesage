$(document).ready(function()
{
	showData("products");

	$('.input-images').imageUploader();

	$(".btn-add-product").on("click", function() {
		$("#modAdd").modal("show");
	});

	$(".btn-save-new-product").on('click',function()
	{
		if ($('#frmNewProduct #txtProductName').val()=='')
		{
			alert('Input product name!');
			$('#frmNewProduct #txtProductName').focus();
			return false;
		}

		if ($('#frmNewProduct #txtDescription').val()=='')
		{
			alert('Input description!');
			$('#frmNewProduct #txtDescription').focus();
			return false;
		}

		if ($('#frmNewProduct #inLogo').val()=='')
		{
			alert('Input logo image!');
			$('#frmNewProduct #inLogo').focus();
			return false;
		}

		var fileElement = $("[name='images[]']");
      	var filesCount = $(fileElement[0]).prop('files').length;
		if (filesCount==0)
		{
			alert("Choose image files for logo!");
			$("[name='images[]']").focus();
			return false;
		}
	  
		var formData = new FormData();
		formData.append('txtProductName', $("#frmNewProduct #txtProductName").val());
		formData.append('txtDescription', $("#frmNewProduct #txtDescription").val());
		formData.append('inLogo', $("#frmNewProduct #inLogo")[0].files[0]);
		for (var index = 0; index < filesCount; index++) {
			formData.append('images[]', $("[name='images[]']")[0].files[index]);
	 	}

		$.ajax({
			url : "http://127.0.0.1:6100/v1/products/addproduct",
			type : 'POST',
			data : formData,
			async: false,
			processData: false,  // tell jQuery not to process the data
			contentType: false,  // tell jQuery not to set contentType
			success : function(data) {
				if (data["msg"]=="ok")
				{
					$("#frmNewProduct #txtProductName").val("");
					$("#frmNewProduct #txtDescription").val("");
					$("#frmNewProduct #inLogo").val("");
					$("#modAdd").modal("hide");
					showData("products");
				}
			}
		});
	});

});

$(document).on("click",".btn-del", function() {
	conf = confirm("Are you sure to delete this product?");
	if (conf==true)
	{
		var pid = $(this).parent().parent().attr("id");
		$.ajax({
			url: "http://127.0.0.1:6100/v1/products/delproduct/"+pid
		}).then(function(data) {
			if (data["msg"]=="ok")
			{
				showData("products");
			}
		});

	}
});

$(document).on("click",".btn-edit", function() {
	var pid = $(this).parent().parent().attr("id");
	$.ajax({
		url: "http://127.0.0.1:6100/v1/products/getproduct/"+pid
	}).then(function(data) {
		if (data["msg"]=="ok")
		{
			console.log(data["data"]);
			d = data["data"];
			$("#frmEditProduct #txtProductID").val(d[0]["productid"]);
			$("#frmEditProduct #txtProductName").val(d[0]["name"]);
			$("#frmEditProduct #txtDescription").val(d[0]["descr"]);
			$("#frmEditProduct #imgLogo").attr("src","http://127.0.0.1:6100/v1/products/showlogo/"+pid);
			$("#modEdit").modal("show");
		}
	});

});

$(document).on("click",".btn-updatelogo", function() {
	if ($("#uploadLogo").val()=='')
	{
		alert("Choose image file to become new logo");
		$("#uploadFile").focus();
		return false;
	}

	var formData = new FormData();
	formData.append('pid', $("#frmEditProduct #txtProductID").val());
	formData.append('inLogo', $("#frmEditProduct #uploadLogo")[0].files[0]);

	var pid = $("#frmEditProduct #txtProductID").val();

	$.ajax({
		url : "http://127.0.0.1:6100/v1/products/updatelogo",
		type : 'POST',
		data : formData,
		async: false,
		processData: false,  // tell jQuery not to process the data
		contentType: false,  // tell jQuery not to set contentType
		success : function(data) {
			console.log(data);
			if (data["msg"]=="ok")
			{
				//var temp = "http://127.0.0.1:6100/v1/products/showlogo/"+pid;
				$("#frmEditProduct #imgLogo").attr("src","");
				$("#frmEditProduct #imgLogo").attr("src","http://127.0.0.1:6100/v1/products/showlogo/"+pid);
				location.reload();
			}
		}
	});

});

$(document).on("click",".btn-save-description", function() {
	if ($("#frmEditProduct #txtDescription").val()=='')
	{
		alert("insert new description");
		$("#frmEditProduct #txtDescription").focus();
		return false;
	}

	var formData = new FormData();
	formData.append('pid', $("#frmEditProduct #txtProductID").val());
	formData.append('pdesc', $("#frmEditProduct #txtDescription").val());

	var pid = $("#frmEditProduct #txtProductID").val();

	$.ajax({
		url : "http://127.0.0.1:6100/v1/products/updateproductdescr",
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
	var uri='';
	if (type=="products")
	{
		$("#tblProducts tbody").html("");
		uri="products/all"
	}
	else
	{
		$("#tblProducts tbody").html("");
		uri="variants/all"
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

			}
		}
	});
}