from flask import Flask, request, jsonify, redirect, url_for
import pymysql
from flask_cors import CORS
import json
from datetime import date
import uuid
import os

# init app
app = Flask(__name__,static_folder='venv/static')
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER_LOGO = 'static/data/images/logo/'
UPLOAD_FOLDER_IMAGES = 'static/data/images/images/'

fc = open('db.json')
dbconf = json.load(fc)

def get_db_connection():
    try:
        conn = pymysql.connect(host=dbconf["hostname"], user=dbconf["user"], password=dbconf["passwd"], database=dbconf["database"],charset=dbconf["charset"],cursorclass=pymysql.cursors.DictCursor)
        return conn
    except:
        return None

def new_random_name(string_length=10):
    # random string for image name
    random = str(uuid.uuid4()) 
    random = random.upper() 
    random = random.replace("-","") 
    return random[0:string_length] 

@app.route('/')
def hello():
   return jsonify({"msg":"SourceSage"})


# product API 
@app.route("/v1/products/all") # all product
def products():
    data = []
    conn = get_db_connection()
    if conn!=None:
        cur = conn.cursor()
        cur.execute("call sp_allproducts()") 
        conn.close()
        for res in cur.fetchall():
            data.append(res)
        return jsonify({"msg":"ok","desc":"all products","data":data})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_allproducts)","data":[]})

@app.route("/v1/products/addproduct", methods=["POST"]) # add product
def addproduct():
    pName = request.form.get('txtProductName')
    pDesc = request.form.get('txtDescription')
    imgLogo = request.files['inLogo']
    imgFiles = request.files.getlist("images[]")
    dateNow = date.today()
    dN = dateNow.strftime("%Y-%m-%d")
    conn = get_db_connection()
    if conn!=None:
        cur = conn.cursor()
        cur.execute("call sp_addproduct('"+pName+"','"+pDesc+"','"+dN+"','"+dN+"')") 
        conn.commit()
        cur.execute("call sp_maxproductid()") 
        pid = cur.fetchone()

        # logo
        targetLogo = os.path.join(APP_ROOT, "venv\static\data\images\logo")
        lN = imgLogo.filename
        temp = lN[-1:-4:-1]
        new_random = new_random_name(8)
        nlN = "\\".join([targetLogo, new_random+"."+temp[-1:-4:-1]])
        nlNPath = new_random+"."+temp[-1:-4:-1]
        imgLogo.save(nlN)
        cur.execute("call sp_addlogo("+str(pid['maxpid'])+",'"+nlNPath+"')") 
        conn.commit()
        cur.execute("call sp_maxlogoid()") 
        lid = cur.fetchone()
        cur.execute("call sp_updatelogoid("+str(lid['maxlogoid'])+","+str(pid['maxpid'])+")") 
        conn.commit()

        # images
        targetImages = os.path.join(APP_ROOT, "venv\static\data\images\images")
        for lf in imgFiles:
            fN = lf.filename
            temp = fN[-1:-4:-1]
            new_random = new_random_name(8)
            nN = "\\".join([targetImages, new_random+"."+temp[-1:-4:-1]])
            nNPath = new_random+"."+temp[-1:-4:-1]
            lf.save(nN)
            cur.execute("call sp_addimages("+str(pid['maxpid'])+",'"+nNPath+"')") 
            conn.commit()
        
        conn.close()
        return jsonify({"msg":"ok","desc":"add product","data":[]})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_addproduct)","data":[]})

@app.route("/v1/products/getproduct/<int:productid>") # choose particular product
def getproduct(productid):
    data = []
    pid = str(productid)
    conn = get_db_connection()
    if conn!=None:
        cur = conn.cursor()
        cur.execute("call sp_partproduct("+pid+")") 
        conn.close()
        for res in cur.fetchall():
            data.append(res)
        return jsonify({"msg":"ok","desc":"particular product","data":data})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_partproduct)","data":[]})

@app.route("/v1/products/delproduct/<int:productid>") # delete particular product
def delproduct(productid):
    pid = str(productid)
    conn = get_db_connection()
    if conn!=None:
        cur = conn.cursor()
        cur.execute("call sp_delproduct("+pid+")") 
        conn.commit()
        conn.close()
        return jsonify({"msg":"ok","desc":"delete particular product","data":[]})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_delproduct)","data":[]})

@app.route("/v1/products/updateproductname", methods=["POST"]) # update product name
def updateproductname():
    pid = request.form.get('pid')
    newpname = request.form.get('pname')
    conn = get_db_connection()
    if conn!=None:
        dateNow = date.today()
        dN = dateNow.strftime("%Y-%m-%d")
        cur = conn.cursor()
        cur.execute("call sp_changeproductname('"+newpname+"','"+dN+"',"+pid+")") 
        conn.commit()
        conn.close()
        return jsonify({"msg":"ok","desc":"update product name","data":[]})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_changeproductname)","data":[]})

@app.route("/v1/products/updateproductdescr", methods=["POST"]) # update product description
def updateproductdescr():
    pid = request.form.get('pid')
    newpdescr = request.form.get('pdesc')
    conn = get_db_connection()
    if conn!=None:
        dateNow = date.today()
        dN = dateNow.strftime("%Y-%m-%d")
        cur = conn.cursor()
        cur.execute("call sp_changeproductdescr('"+newpdescr+"','"+dN+"',"+pid+")") 
        conn.commit()
        conn.close()
        return jsonify({"msg":"ok","desc":"update product description","data":[]})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_changeproductdescr)","data":[]})


@app.route("/v1/products/updatelogo", methods=["POST"]) # update product logo
def updatelogo():
    pid = request.form.get('pid')
    newlogo = request.files['inLogo']
    conn = get_db_connection()
    if conn!=None:
        targetLogo = os.path.join(APP_ROOT, "venv\static\data\images\logo")
        lN = newlogo.filename
        temp = lN[-1:-4:-1]
        new_random = new_random_name(8)
        nlN = "\\".join([targetLogo, new_random+"."+temp[-1:-4:-1]])
        nlNPath = new_random+"."+temp[-1:-4:-1]
        newlogo.save(nlN)
        cur = conn.cursor()
        cur.execute("call sp_changelogo("+str(pid)+",'"+nlNPath+"')") 
        conn.commit()
        cur.execute("call sp_showlogo("+pid+")") 
        p = cur.fetchone()
        conn.close()
        return jsonify({"msg":"ok","desc":"update product logo","data":p['path']})
        #return redirect(url_for('static', filename="data/images/logo/"+p['path']))
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_delproduct)","data":[]})

@app.route("/v1/products/showlogo/<int:productid>") # show product logo
def showlogo(productid):
    pid = str(productid)
    conn = get_db_connection()
    if conn!=None:
        cur = conn.cursor()
        cur.execute("call sp_showlogo("+pid+")") 
        p = cur.fetchone()
        conn.commit()
        conn.close()
        #return jsonify({"msg":"ok","desc":"update particular product","data":[]})
        return redirect(url_for('static', filename="data/images/logo/"+p['path']))
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_showlogo)","data":[]})

# variant API
@app.route("/v1/variants/getvariant/<int:productid>") # all variants in particular product
def variants(productid):
    data = []
    pid = str(productid)
    conn = get_db_connection()
    if conn!=None:
        cur = conn.cursor()
        cur.execute("call sp_allvariants("+pid+")") 
        conn.close()
        for res in cur.fetchall():
            data.append(res)
        return jsonify({"msg":"ok","desc":"all variants","data":data})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_allvariants)","data":[]})

@app.route("/v1/variants/getparticularvariant/<int:variantid>") # all variants in particular product
def getparticularvariant(variantid):
    data = []
    vid = str(variantid)
    conn = get_db_connection()
    if conn!=None:
        cur = conn.cursor()
        cur.execute("call sp_getparticularvariant("+vid+")") 
        conn.close()
        res = cur.fetchone()
        data.append({"productid":res["productid"]})
        data.append({"name":res["name"]})
        data.append({"size":res["size"]})
        data.append({"color":res["color"]})
        return jsonify({"msg":"ok","desc":"particular variant","data":data})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_getparticularvariant)","data":[]})

@app.route("/v1/variants/updatevariantproduct", methods=["POST"]) # update product description
def updatevariantproduct():
    vid = request.form.get('vid')
    pid = request.form.get('pid')
    conn = get_db_connection()
    if conn!=None:
        dateNow = date.today()
        dN = dateNow.strftime("%Y-%m-%d")
        cur = conn.cursor()
        cur.execute("call sp_changevariantproduct("+vid+","+pid+")") 
        conn.commit()
        conn.close()
        return jsonify({"msg":"ok","desc":"update variant product","data":[]})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_changevariantproduct)","data":[]})

@app.route("/v1/variants/updatevariantname", methods=["POST"]) # update product description
def updatevariantname():
    vid = request.form.get('vid')
    name = request.form.get('name')
    conn = get_db_connection()
    if conn!=None:
        dateNow = date.today()
        dN = dateNow.strftime("%Y-%m-%d")
        cur = conn.cursor()
        cur.execute("call sp_changevariantname("+vid+",'"+name+"')") 
        conn.commit()
        conn.close()
        return jsonify({"msg":"ok","desc":"update variant product","data":[]})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_changevariantname)","data":[]})

@app.route("/v1/variants/updatevariantsize", methods=["POST"]) # update product description
def updatevariantsize():
    vid = request.form.get('vid')
    size = request.form.get('size')
    conn = get_db_connection()
    if conn!=None:
        dateNow = date.today()
        dN = dateNow.strftime("%Y-%m-%d")
        cur = conn.cursor()
        cur.execute("call sp_changevariantsize("+vid+",'"+size+"')") 
        conn.commit()
        conn.close()
        return jsonify({"msg":"ok","desc":"update variant size","data":[]})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_changevariantsize)","data":[]})

@app.route("/v1/variants/updatevariantcolor", methods=["POST"]) # update product description
def updatevariantcolor():
    vid = request.form.get('vid')
    color = request.form.get('color')
    conn = get_db_connection()
    if conn!=None:
        dateNow = date.today()
        dN = dateNow.strftime("%Y-%m-%d")
        cur = conn.cursor()
        cur.execute("call sp_changevariantsize("+vid+",'"+color+"')") 
        conn.commit()
        conn.close()
        return jsonify({"msg":"ok","desc":"update variant color","data":[]})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_changevariantcolor)","data":[]})

@app.route("/v1/variants/getimages/<int:variantid>") # all variants in particular product
def getimages(variantid):
    data = []
    vid = str(variantid)
    conn = get_db_connection()
    if conn!=None:
        cur = conn.cursor()
        cur.execute("call sp_getimagesvariant("+vid+")") 
        conn.close()
        for res in cur.fetchall():
            data.append(res)
        return jsonify({"msg":"ok","desc":"all variants images","data":data})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_getimagesvariant)","data":[]})

@app.route("/v1/variants/showimage/<string:path>") # show variants image
def showimage(path):
    path = path
    return redirect(url_for('static', filename="data/images/images/variants/"+path))

@app.route("/v1/variants/addvariant", methods=["POST"]) # add product
def addvariant():
    vPid = request.form.get('txtProductID')
    vName = request.form.get('txtVariantName')
    vSize = request.form.get('txtVariantSize')
    vColor = request.form.get('txtVariantColor')
    imgFiles = request.files.getlist("images[]")
    dateNow = date.today()
    dN = dateNow.strftime("%Y-%m-%d")
    conn = get_db_connection()
    if conn!=None:
        cur = conn.cursor()
        cur.execute("call sp_addvariant('"+vName+"','"+vSize+"','"+vColor+"','"+dN+"',"+vPid+")") 
        conn.commit()
        cur.execute("call sp_maxvariantid()") 
        pid = cur.fetchone()

        # images
        targetImages = os.path.join(APP_ROOT, "venv\static\data\images\images\\variants")
        for lf in imgFiles:
            fN = lf.filename
            temp = fN[-1:-4:-1]
            new_random = new_random_name(8)
            nN = "\\".join([targetImages, new_random+"."+temp[-1:-4:-1]])
            nNPath = new_random+"."+temp[-1:-4:-1]
            lf.save(nN)
            cur.execute("call sp_addimagesvariant("+str(pid['maxvid'])+",'"+nNPath+"')") 
            conn.commit()
        
        conn.close()
        return jsonify({"msg":"ok","desc":"add variant","data":[]})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_addvariant)","data":[]})


@app.route("/v1/variants/delvariant/<int:variantid>") # delete particular product
def delvariant(variantid):
    vid = str(variantid)
    conn = get_db_connection()
    if conn!=None:
        cur = conn.cursor()
        cur.execute("call sp_delvariant("+vid+")") 
        conn.commit()
        conn.close()
        return jsonify({"msg":"ok","desc":"delete particular variant","data":[]})
    else:
        return jsonify({"msg":"error","desc":"Error in database (sp_delvariant)","data":[]})

if __name__=="__main__":
    app.run(debug=True, host="0.0.0.0", port=6100) # run server


