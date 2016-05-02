var ToolBar = function(element, options){
    //console.log(options);
    this.annotools = options.annotool;
    //console.log(this.annotools);

    this.source = element; //The Tool Source Element
    this.top = options.top || '0px';
    this.left = options.left || '150px'; //The Tool Location   
    this.height = options.height || '30px';
    this.width = options.width || '270px';
    this.zindex = options.zindex || '100'; //To Make Sure The Tool Appears in the Front

    this.iid = options.iid || null; 
    this.annotationActive = isAnnotationActive();
}
ToolBar.prototype.showMessage = function(msg){
    console.log(msg);
};


ToolBar.prototype.algorithmSelector = function() {
    var self = this;
    var ftree;
    xxx = [];


}

var available_colors = ["lime", "red", "blue", "orange"];
var algorithm_color = {};

function goodalgo(data, status) {
    //console.log(data);
    

    var blob = [];
    for (i=0;i<data.length;i++) {
        var n = {};
        //console.log(data[i]);
        n.title = "<div class='colorBox' style='background:"+available_colors[i]+ "'></div>" + data[i].title;
        n.key = i.toString();
        n.refKey = data[i].analysis_execution_id;
        n.color = available_colors[i];
        algorithm_color[data[i].analysis_execution_id] = available_colors[i];
        blob.push(n);
    }
    ftree = jQuery("#tree").fancytree({
        source: [{
            title: "Algorithms", key: "1", folder: true,
            children: blob,
            expanded: true
        }],
        minExpandLevel: 1, // 1: root node is not collapsible
        activeVisible: true, // Make sure, active nodes are visible (expanded).
        aria: false, // Enable WAI-ARIA support.
        autoActivate: true, // Automatically activate a node when it is focused (using keys).
        autoCollapse: false, // Automatically collapse all siblings, when a node is expanded.
        autoScroll: false, // Automatically scroll nodes into visible area.
        clickFolderMode: 4, // 1:activate, 2:expand, 3:activate and expand, 4:activate (dblclick expands)
        checkbox: true, // Show checkboxes.
        debugLevel: 2, // 0:quiet, 1:normal, 2:debug
        disabled: false, // Disable control
        focusOnSelect: false, // Set focus when node is checked by a mouse click
        generateIds: false, // Generate id attributes like <span id='fancytree-id-KEY'>
        idPrefix: "ft_", // Used to generate node id´s like <span id='fancytree-id-<key>'>.
        icons: true, // Display node icons.
        keyboard: true, // Support keyboard navigation.
        keyPathSeparator: "/", // Used by node.getKeyPath() and tree.loadKeyPath().
        minExpandLevel: 1, // 1: root node is not collapsible
        quicksearch: false, // Navigate to next node by typing the first letters.
        selectMode: 2, // 1:single, 2:multi, 3:multi-hier
        tabbable: true, // Whole tree behaves as one single control
        titlesTabbable: false, // Node titles can receive keyboard focus
        beforeSelect: function(event, data){
            // A node is about to be selected: prevent this for folders:
            if( data.node.isFolder() ){
                return false;
            }
        },
        select: function(event, data) {
            jQuery("#tree").attr("algotree",true);
                var node = data.node;

                console.log("!SELECTED NODE : "+node.title);
                targetType = data.targetType;
                annotool.getMultiAnnot();
        }
    });
}

ToolBar.prototype.toggleAlgorithmSelector = function() {    
    if (!jQuery('#algosel').attr("eb")) {
        jQuery('#algosel').attr("eb", true);
        //console.log("initializing...");
        jQuery('#algosel').css({
           "width": "300px",
           "zIndex": 199,
           "visibility": "hidden"
        });
        jQuery('#algosel').on('mousedown', function(e) {
           jQuery(this).addClass('draggable').parents().on('mousemove', function(e) {
              jQuery('.draggable').offset({
                 top: e.pageY - jQuery('.draggable').outerHeight() / 2,
                 left: e.pageX - jQuery('.draggable').outerWidth() / 2
              }).on('mouseup', function() {
                 jQuery(this).removeClass('draggable');
              });
           });
           e.preventDefault();
        }).on('mouseup', function() {
           jQuery('.draggable').removeClass('draggable');
        });
    }
    if (jQuery('#algosel').css("visibility") == "visible") {
        jQuery('#algosel').css({
            "visibility": "hidden"
    });
    } else {
    jQuery('#algosel').css({
       "visibility": "visible"
    });
    }
    this.showMessage("Algorithm Selection Toggled");
}

ToolBar.prototype.createButtons = function(){
    //this.tool = jQ(this.source);
    var tool = jQuery("#"+"tool"); //Temporary dom element while we clean up mootools
    var self =this;

    
    //Fetch algorithms for Image
    jQuery(document).ready(function() {
           //console.log(options);
        //var self= this;

        jQuery.get("api/Data/getAlgorithmsForImage.php?iid="+self.iid, function(data){


            d = JSON.parse(data);


            goodalgo(d,null);

        });
        //console.log("here");
        jQuery('#submitbtn').click( function () {
                var selKeys = jQuery("#tree").fancytree('getTree').getSelectedNodes();
                var param = "";
                for (i=0;i<selKeys.length;i++) {
                        param = param + "&Val"+(i+1).toString()+"="+selKeys[i].title;
                }
            });
    });






    tool.css({
        "position": "absolute", 
        'left': this.left,
        'top': this.top,
        'width': this.width,
        'height': this.height,
        'z-index': this.zindex   
    });

    tool.addClass('annotools'); //Update Styles
    //this.tool.makeDraggable(); //Make it Draggable.
    
    
    if(this.annotationActive)
    {
        
        /*
         * Ganesh
         * Mootools to Jquery for creation of toolbar buttons
         */
        this.rectbutton = jQuery("<img>", {
            title: "Draw Rectangle", 
            class: "toolButton firstToolButtonSpace", 
            src: "images/rect.svg"
        });
        tool.append(this.rectbutton);

        this.ellipsebutton = jQuery("<img>", {
            'title': 'Draw Ellipse',
            'class': 'toolButton',
            'src': 'images/ellipse.svg'
        });
        tool.append(this.ellipsebutton);

        this.pencilbutton = jQuery('<img>', {
            'title': 'Draw Freeline',
            'class': 'toolButton',
            'src': 'images/pencil.svg'
        });
        tool.append(this.pencilbutton); //Pencil Tool
        
        this.measurebutton = jQuery('<img>', {
            'title': 'Measurement Tool',
            'class': 'toolButton',
            'src': 'images/measure.svg'
        });
        //tool.append(this.measurebutton);

        this.spacer2 = jQuery('<img>', {
            'class': 'spacerButton',
            'src': 'images/spacer.svg'
        });
        tool.append(this.spacer2);
        
        this.filterbutton = jQuery('<img>', {
            'title': 'Filter Markups',
            'class': 'toolButton',
            'src': 'images/filter.svg'
        });
        tool.append(this.filterbutton); //Filter Button

        this.hidebutton = jQuery('<img>', {
            'title': 'Show/Hide Markups',
            'class': 'toolButton',
            'src': 'images/hide.svg'
        });
        tool.append(this.hidebutton);
        

       


        this.fullDownloadButton = jQuery('<img>', {
            'title': 'Download All Markups (Coming Soon)',
            'class': 'toolButton',
            'src': 'images/fullDownload.svg'
        });
        tool.append(this.fullDownloadButton);
        
        this.partialDownloadButton = jQuery('<img>', {
            'title': 'Download Partial Markups (Coming Soon)',
            'class': 'toolButton',
            'src': 'images/partDownload.svg'
        });
        //tool.append(this.partialDownloadButton);  //Partial Download
  this.spacer1 = jQuery("<img>", {
            'class': 'spacerButton', 
            'src': 'images/spacer.svg'
        });
        tool.append(this.spacer1);
       
        /*
         * Event handlers on click for the buttons
         */
        this.rectbutton.on("click", function(){
           // this.mode = 'rect';
           // this.annotools.drawMarkups();
            alert("Creation of markups is disabled on QuIP");
        }.bind(this));

        this.ellipsebutton.on("click", function(){
            //this.mode = 'ellipse';
            //this.annotools.mode = 'ellipse';
            //this.annotools.drawMarkups();
           alert("Creation of markups is disabled on QuIP");
        }.bind(this));

        this.pencilbutton.on('click', function () {
            //    this.mode = 'pencil';
            //    this.drawMarkups();
                  alert("Creation of markups is disabled on QuIP");
        }.bind(this));

        this.measurebutton.on('click', function () {
                this.mode = 'measure';
                this.drawMarkups();
        }.bind(this));       

        this.hidebutton.on('click', function () {
            this.annotools.toggleMarkups()
        }.bind(this));

        this.filterbutton.on('click', function () {
            this.toggleAlgorithmSelector(); 
            //this.removeMouseEvents();
            //this.promptForAnnotation(null, "filter", this, null);
        }.bind(this));

        var toolButtons = jQuery(".toolButton");
        toolButtons.each(function(){
            jQuery(this).on({
                'mouseenter': function(){
                    this.addClass('selected');
                },
                'mouseleave': function(){
                    this.removeClass('selected');
                }
            });
        });

        /*
        for (var i = 0; i < toolButtons.length; i++) {
            toolButtons[i].on({
                'mouseenter': function () {
                    this.addClass('selected')
                },
                'mouseleave': function () {
                    this.removeClass('selected')
                }
            });
        }
        */
        
        /*
         * Ganesh: Using the Mootools version as the jquery version breaks things 
         *
        this.messageBox = jQuery('<div>', {
            'id': 'messageBox'
        });
        jQuery("body").append(this.messageBox);
        */





    }
    this.colorMapButton = jQuery('<img>', {
        'class': 'colorMapButton',
        'title': 'ColorMap',
        'src': 'images/colors.svg'
    });
    tool.append(this.colorMapButton);
    this.ajaxBusy = jQuery('<img>', {
        'class': 'colorMapButton',
        'id': 'ajaxBusy',
        'style': 'scale(0.5, 1)',
        'src': 'images/progress_bar.gif'
    });
    tool.append(this.ajaxBusy);
    this.ajaxBusy.hide();


    this.titleButton = jQuery('<p>',{
        'class' : 'titleButton',
        'text' : 'caMicroscope'
    });
    tool.append(this.titleButton);


    this.iidbutton = jQuery('<p>', {
        'class': 'iidButton',
        'text': 'SubjectID :' + this.iid
    });
    tool.append(this.iidbutton);

    /* ASHISH - disable quit button
        this.quitbutton = new Element('img', {
            'title': 'quit',
            'class': 'toolButton',
            'src': 'images/quit.svg'
        }).inject(this.tool); //Quit Button
    */
    if(this.annotationActive)
    {

    }
};

ToolBar.prototype.drawMarkups= function () //Draw Markups
{
    //console.log(this.annotools);
    //this.showMessage(); //Show Message
    
    this.annotools.drawCanvas.removeEvents('mouseup');
    this.annotools.drawCanvas.removeEvents('mousedown');
    this.annotools.drawCanvas.removeEvents('mousemove');
    
    this.annotools.drawLayer.show(); //Show The Drawing Layer
/* ASHISH Disable quit
    this.quitbutton.show(); //Show The Quit Button
*/
    this.magnifyGlass.hide(); //Hide The Magnifying Tool
    this.container = document.id(this.canvas); //Get The Canvas Container
    this.container = document.getElementsByClassName(this.canvas)[0]; //Get The Canvas Container
    this.container = document.getElementById('container'); //Get The Canvas Container
    if (this.container) {
        //var left = parseInt(this.container.offsetLeft), //Get The Container Location
        var left = parseInt(this.container.getLeft()), //Get The Container Location
            top = parseInt(this.container.offsetTop),
            width = parseInt(this.container.offsetWidth),
            height = parseInt(this.container.offsetHeight),
            oleft = left,
            otop = top,
            owidth = width,
            oheight = height;
        //console.log("left: " + left + " top: " + top + " width: " + width + " height: " + height);
        if (left < 0) {
            left = 0;
            width = window.innerWidth;
        } //See Whether The Container is outside The Current ViewPort
        if (top < 0) {
            top = 0;
            height = window.innerHeight;
        }
        //Recreate The CreateAnnotation Layer Because of The ViewPort Change Issue.
        this.drawLayer.set({
            'styles': {
                left: left,
                top: top,
                width: width,
                height: height
            }
        });
        //Create Canvas on the CreateAnnotation Layer
        this.drawCanvas.set({
            width: width,
            height: height
        });
        //The canvas context
        var ctx = this.drawCanvas.getContext("2d");
        //Draw Markups on Canvas
        switch (this.mode) {
            case "rect":
                //console.log("rectangle");
                this.drawRectangle(ctx);
                break;
            case "ellipse":
                this.drawEllipse(ctx);
                break;
            case "pencil":
                this.drawPencil(ctx);
                break;
            case "polyline":
                this.drawPolyline(ctx);
                break;
            case "measure":
                this.drawMeasure(ctx);
                break;
        }
    } else this.showMessage("Container Not SET Correctly Or Not Fully Loaded Yet");
    
};


ToolBar.prototype.drawPencil= function(ctx)
{
    this.removeMouseEvents();
    var started = false;
    var pencil = [];
    var newpoly = [];
    this.drawCanvas.addEvent('mousedown',function(e)
    {
        started = true;
        var startPoint = OpenSeadragon.getMousePosition(e.event);
        var relativeStartPoint = startPoint.minus(OpenSeadragon.getElementOffset(viewer.canvas));
        newpoly.push({
        "x":relativeStartPoint.x,
        "y":relativeStartPoint.y
        });
        ctx.beginPath();
        ctx.moveTo(relativeStartPoint.x, relativeStartPoint.y)
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }.bind(this));

    this.drawCanvas.addEvent('mousemove',function(e)
    {
        var newPoint = OpenSeadragon.getMousePosition(e.event);
        var newRelativePoint = newPoint.minus(OpenSeadragon.getElementOffset(viewer.canvas));
        if(started)
        {
        newpoly.push({
            "x":newRelativePoint.x,
            "y":newRelativePoint.y
            });

        ctx.lineTo(newRelativePoint.x,newRelativePoint.y);
        ctx.stroke();
        }
    });

    this.drawCanvas.addEvent('mouseup',function(e)
    {
        started = false;
        pencil.push(newpoly);
        newpoly = [];
        numpoint = 0;
        var x,y,w,h;
        x = pencil[0][0].x;
        y = pencil[0][0].y;

        var maxdistance = 0;
        var points = "";
        var endRelativeMousePosition;
        for(var i = 0; i < pencil.length; i++)
        {
        newpoly = pencil[i];
        for(j = 0; j < newpoly.length - 1; j++)
        {
            points += newpoly[j].x + ',' + newpoly[j].y + ' ';
            if(((newpoly[j].x - x) * (newpoly[j].x - x) + (newpoly[j].y -y) * (newpoly[j].y-y)) > maxdistance)
            {
            maxdistance = ((newpoly[j].x - x) * (newpoly[j].x - x) + (newpoly[j].y -y) * (newpoly[j].y-y));
            var endMousePosition = new OpenSeadragon.Point(newpoly[j].x, newpoly[j].y);
            endRelativeMousePosition = endMousePosition.minus(OpenSeadragon.getElementOffset(viewer.canvas));
            }
        }

        points = points.slice(0,-1);
        points += ';';
        }

        points = points.slice(0,-1);

        var newAnnot = {
            x:x,
            y:y,
            w:w,
            h:h,
            type: 'pencil',
            points: points,
            color: this.color,
            loc: new Array()
        };

        var globalNumbers = JSON.parse(this.convertFromNative(newAnnot, endRelativeMousePosition));
        newAnnot.x = globalNumbers.nativeX;
        newAnnot.y = globalNumbers.nativeY;
        newAnnot.w = globalNumbers.nativeW;
        newAnnot.h = globalNumbers.nativeH;
        newAnnot.points = globalNumbers.points;
        var loc = new Array();
        loc[0] = parseFloat(newAnnot.x);
        loc[1] = parseFloat(newAnnot.y);
        newAnnot.loc = loc;
            this.promptForAnnotation(newAnnot, "new", this, ctx);
    }.bind(this));
};



