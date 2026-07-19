/*=========================================================
RIFKI PORTFOLIO
=========================================================*/

$(function(){

    "use strict";

    /*=====================================
    Loader
    =====================================*/

    setTimeout(function(){

        $("#loader").fadeOut(700);

    },1000);

    /*=====================================
    Navbar Scroll
    =====================================*/

    $(window).scroll(function(){

        if($(this).scrollTop()>80){

            $(".navbar").addClass("scrolled");

        }else{

            $(".navbar").removeClass("scrolled");

        }

    });

    /*=====================================
    Smooth Scroll
    =====================================*/

    $('a[href^="#"]').click(function(e){

        e.preventDefault();

        let target=$(this.hash);

        if(target.length){

            $("html,body").animate({

                scrollTop:target.offset().top-80

            },700);

        }

    });

    /*=====================================
    Counter
    =====================================*/

    $(".counter").each(function(){

        let counter=$(this);

        let target=parseInt(counter.attr("data-target"));

        let count=0;

        let speed=target/100;

        let interval=setInterval(function(){

            count+=speed;

            if(count>=target){

                count=target;

                clearInterval(interval);

            }

            counter.text(Math.floor(count));

        },20);

    });

    /*=====================================
    AOS
    =====================================*/

    AOS.init({

        duration:1200,

        once:true,

        offset:100

    });

    /*=====================================
    Swiper
    =====================================*/

    new Swiper(".testimonial-slider",{

        loop:true,

        speed:1000,

        autoplay:{

            delay:4000,

            disableOnInteraction:false

        },

        pagination:{

            el:".swiper-pagination",

            clickable:true

        }

    });

});
/*=========================================
Typing Hero
=========================================*/

const typingText=[
    "Full Stack Developer",
    "AI Engineer",
    "Founder",
    "Software Consultant"
];

let txtIndex=0;
let charIndex=0;

const typing=document.getElementById("typing");

function type(){

    if(!typing) return;

    if(charIndex<typingText[txtIndex].length){

        typing.innerHTML+=typingText[txtIndex].charAt(charIndex);

        charIndex++;

        setTimeout(type,70);

    }else{

        setTimeout(erase,1800);

    }

}

function erase(){

    if(charIndex>0){

        typing.innerHTML=typingText[txtIndex].substring(0,charIndex-1);

        charIndex--;

        setTimeout(erase,35);

    }else{

        txtIndex++;

        if(txtIndex>=typingText.length){

            txtIndex=0;

        }

        setTimeout(type,500);

    }

}

type();

const glow=document.createElement("div");

glow.className="mouse-glow";

document.body.appendChild(glow);

document.addEventListener("mousemove",e=>{

    glow.style.left=e.clientX+"px";

    glow.style.top=e.clientY+"px";

});

const topBtn=document.getElementById("topButton");

window.addEventListener("scroll",()=>{

if(window.scrollY>400){

topBtn.classList.add("show");

}else{

topBtn.classList.remove("show");

}

});

topBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};