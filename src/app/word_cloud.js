/* eslint-disable  no-use-before-define */
import d3 from 'd3';
import cloudLayout from 'd3-cloud';
import $ from 'jquery'

import './word_cloud.css';
var div1_width;
var div1_height;
var div1_id;


function wordCloudChart(slice, payload){

  const chart = d3.select(slice.selector);

  const data = payload.data;
  const fd = slice.formData;

  var sa;
  var ca;
  var sb;
  var cb;
  var sc;
  var cc;
  var per;


    // console.log($(`#slice_${slice.formData.slice_id} .chart-header`).parent());
    var title_height = 0 ;
    if($(`#slice_${slice.formData.slice_id} .chart-header`).parent().height()){
        title_height = $(`#slice_${slice.formData.slice_id} .chart-header`).parent().height()
    }

    div1_height = (slice.height() - title_height)+'px';
    div1_width  = slice.width() + 'px';
    div1_id = "div1_"+slice.formData.slice_id;


    var radius =  Math.min(slice.width(),slice.height() - title_height) / 2.5; //180;//3D 球的半径
    var dtr = Math.PI/180;
    var d=600;

    var mcList = [];
    var active = true;
    var lasta = 10;
    var lastb = 10;
    var distr = true;
    var tspeed=1;//文字移动速度
    var size=250;

    var mouseX=50;
    var mouseY=50;

    var howElliptical=1;

    var aA=null;
    var oDiv=null;

    function update()
    {

        var a;
        var b;

        if(active)
        {
            a = (-Math.min( Math.max( -mouseY, -size ), size ) / radius ) * tspeed;
            b = (Math.min( Math.max( -mouseX, -size ), size ) / radius ) * tspeed;
        }
        else
        {
            a = lasta * 0.1;
            b = lastb * 0.1;
        }

        lasta=a;
        lastb=b;

        if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01)
        {
            return;
        }

        var c=0;
        sineCosine(a,b,c);
        for(var j=0;j<mcList.length;j++)
        {
            var rx1=mcList[j].cx;
            var ry1=mcList[j].cy*ca+mcList[j].cz*(-sa);
            var rz1=mcList[j].cy*sa+mcList[j].cz*ca;

            var rx2=rx1*cb+rz1*sb;
            var ry2=ry1;
            var rz2=rx1*(-sb)+rz1*cb;

            var rx3=rx2*cc+ry2*(-sc);
            var ry3=rx2*sc+ry2*cc;
            var rz3=rz2;

            mcList[j].cx=rx3;
            mcList[j].cy=ry3;
            mcList[j].cz=rz3;

            per=d/(d+rz3);

            mcList[j].x=(howElliptical*rx3*per)-(howElliptical*2);
            mcList[j].y=ry3*per;
            mcList[j].scale=per;
            mcList[j].alpha=per;

            mcList[j].alpha=(mcList[j].alpha-0.6)*(10/6);
        }

        doPosition();
        depthSort();
    }

    function depthSort()
    {
        var i=0;
        var aTmp=[];

        for(i=0;i<aA.length;i++)
        {
            aTmp.push(aA[i]);
        }

        aTmp.sort
        (
            function (vItem1, vItem2)
            {
                if(vItem1.cz>vItem2.cz)
                {
                    return -1;
                }
                else if(vItem1.cz<vItem2.cz)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
        );

        for(i=0;i<aTmp.length;i++)
        {
            aTmp[i].style.zIndex=i;
        }
    }

    function positionAll()
    {
        var phi=0;
        var theta=0;
        var max=mcList.length;
        var i=0;

        var aTmp=[];
        var oFragment=document.createDocumentFragment();

        for(i=0;i<aA.length;i++)
        {
            aTmp.push(aA[i]);
        }

        aTmp.sort
        (
            function ()
            {
                return Math.random()<0.5?1:-1;
            }
        );

        for(i=0;i<aTmp.length;i++)
        {
            oFragment.appendChild(aTmp[i]);
        }

        oDiv.appendChild(oFragment);

        for( var i=1; i<max+1; i++){
            if( distr )
            {
                phi = Math.acos(-1+(2*i-1)/max);
                theta = Math.sqrt(max*Math.PI)*phi;
            }
            else
            {
                phi = Math.random()*(Math.PI);
                theta = Math.random()*(2*Math.PI);
            }

            mcList[i-1].cx = radius * Math.cos(theta)*Math.sin(phi);
            mcList[i-1].cy = radius * Math.sin(theta)*Math.sin(phi);
            mcList[i-1].cz = radius * Math.cos(phi);

            aA[i-1].style.left=mcList[i-1].cx+oDiv.offsetWidth/2-mcList[i-1].offsetWidth/2+'px';
            aA[i-1].style.top=mcList[i-1].cy+oDiv.offsetHeight/2-mcList[i-1].offsetHeight/2+'px';
        }
    }

    function doPosition()
    {
        var l=oDiv.offsetWidth/2;
        var t=oDiv.offsetHeight/2;
        for(var i=0;i<mcList.length;i++)
        {
            aA[i].style.left=mcList[i].cx+l-mcList[i].offsetWidth/2+'px';
            aA[i].style.top=mcList[i].cy+t-mcList[i].offsetHeight/2+'px';
            aA[i].style.filter="alpha(opacity="+100*mcList[i].alpha+")";
            aA[i].style.opacity=mcList[i].alpha;
        }
    }

    function sineCosine(a, b, c)
    {
        sa = Math.sin(a * dtr);
        ca = Math.cos(a * dtr);
        sb = Math.sin(b * dtr);
        cb = Math.cos(b * dtr);
        sc = Math.sin(c * dtr);
        cc = Math.cos(c * dtr);
    }


    function draw(data) {
        var i = 0;
        var oTag = null;
        var newData = {};

        data.map((dd,i)=>{
            if(i<50) {
                newData[dd.text] = Math.random() * 20;
            }
        });


        draw1(newData);


        function draw1(data) {

            var items = [];

            var val_low = 9999;
            var val_high = -9999;

            $.each(data,function(key,val){
                if(val > val_high){
                    val_high = val;
                }

if(val < val_low){
                    val_low = val;
                }
            });


            $.each(data, function (key, val) {
                if(val > 20){
                    val = 20;
                }

            //    var fd_color =  getColorFromScheme(key, fd.color_scheme);
                d3.select('#'+div1_id).remove();

                var fontsize_low = fd.size_from;
                var fontsize_high = fd.size_to;

                var font_linear_scale = d3.scale.linear()
                    .range([fontsize_low,fontsize_high])
                    .domain([val_low,val_high]);

                // tag_addFilter('医疗急救');
                items.push("<a class='tags' href=\"javascript:void(0)\"  ' style=font-size:" + Math.floor(font_linear_scale(val))  + " >" + key + "</a>");

            });
            $("<div/>", {
                "class":"wordCloud",
                "id": div1_id,
                style: "border:solid 2px none; width:"+div1_width+"!important; height:"+div1_height+" !important;",
                ALIGN: "center",
                html: items.join("")
            }).appendTo(chart);

            oDiv = document.getElementById(div1_id);
            aA = oDiv.getElementsByTagName('a');

            for (i = 0; i < aA.length; i++) {
                oTag = {};
                oTag.offsetWidth = aA[i].offsetWidth;
                oTag.offsetHeight = aA[i].offsetHeight;
                aA[i].onclick = function(event){
                    slice.isFiltered = true;
                    slice.addFilter(slice.props.formData.series, event.path[0].textContent, false, true);
                };

                aA[i].ondblclick = function(){
                    slice.addFilter(slice.props.formData.series, '', false, true);
                };
                mcList.push(oTag);
            }

            sineCosine(0, 0, 0);

            positionAll();

            oDiv.onmouseover = function () {
                active = false;
            };

            oDiv.onmouseout = function () {
                active = true;
            };

            oDiv.onmousemove = function (ev) {
                var oEvent = window.event || ev;

                mouseX = oEvent.clientX - (oDiv.offsetLeft + oDiv.offsetWidth / 2);
                mouseY = oEvent.clientY - (oDiv.offsetTop + oDiv.offsetHeight / 2);

                mouseX /= 5;
                mouseY /= 5;
            };

            setInterval(update, 30);

        };

    }

    draw(data);

}

module.exports = wordCloudChart;
