//------------------------------------------------------------------------
// Initialize Highlighting On Load -->
//------------------------------------------------------------------------

hljs.initHighlightingOnLoad();

//------------------------------------------------------------------------
// Initialize Main Functioanlity -->
//------------------------------------------------------------------------
jQuery(document).ready(function ($) {

    //	Main Page Menu -->
	$('body').addClass('op-menu');
	$('body').prepend('<div class="overlay"><span class="circle-top"></span><span class="circle-bottom"></span></div>');
		
	$('#toggle').click(function(e) {
        e.stopPropagation();
        closeMenu($(this));
    });
    $('.overlay').click(function(e) {
        closeMenu($('#toggle'));
    });
    
    var closeMenu = function (close) {
		if (close.is('#toggle')) {
			close.toggleClass('on');
			$('html, body, .overlay, .sidebar, .menu-left-part, .menu-right-part').toggleClass('active');
		}
    };
    // InstaFeed.js Methods -->
    var instafeedId = $("#instafeed");
    if ($("#instafeed").length) {
        var feed = new Instafeed({
            get: 'user',
            userId: '5949033596',
            resolution: 'standard_resolution',
            template: '<figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject"><a href="{{image}}" itemprop="contentUrl" class="thumbnail-img" data-size="{{width}}x{{height}}"><img src="{{image}}" alt="{{caption}}" itemprop="thumbnail" class="image activator"/></a><figcaption itemprop="caption description">{{caption}}</figcaption></figure>',
            accessToken: '5949033596.6d865ac.eb2e0457c3b742e7a526e06fa92345ca'
        });
        feed.run();
    }

    // clipboard -->
    var clipInit = false;
    $('code').each(function () {
        var code = $(this),
            text = code.text();

        if (text.length > 5) {
            if (!clipInit) {
                var text, clip = new ClipboardJS('.copy-to-clipboard', {
                    text: function (trigger) {
                        text = $(trigger).prev('code').text();
                        return text.replace(/^\$\s/gm, '');
                    }
                });

                var inPre;
                clip.on('success', function (e) {
                    e.clearSelection();
                    inPre = $(e.trigger).parent().prop('tagName') == 'PRE';
                    $(e.trigger).attr('aria-label', 'Copied to clipboard!').addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
                });

                clip.on('error', function (e) {
                    inPre = $(e.trigger).parent().prop('tagName') == 'PRE';
                    $(e.trigger).attr('aria-label', fallbackMessage(e.action)).addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
                    $(document).one('copy', function () {
                        $(e.trigger).attr('aria-label', 'Copied to clipboard!').addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
                    });
                });

                clipInit = true;
            }

            code.after('<span class="copy-to-clipboard" title="Copy to clipboard" />');
            code.next('.copy-to-clipboard').on('mouseleave', function () {
                $(this).attr('aria-label', null).removeClass('tooltipped tooltipped-s tooltipped-w');
            });
        }
    });

    // toastr function -->
    $(".copy-to-clipboard").click(function () {
        toastr.options.positionClass = "toast-top-right";
        toastr.success('&nbsp; &nbsp; Copied to the clipboard');
    });

    // Blur other blog items -->
    $(".blog-item-holder").hover(function () {
        $(".blog-item-holder").not(this).addClass('blur');
    },
    function () {
        $(".blog-item-holder").removeClass('blur');
    });

    // Scroll to Top
    var btn = $('.scroll-top');
    $(window).scroll(function() {
      if ($(window).scrollTop() > 300) {
        btn.addClass('show');
      } else {
        btn.removeClass('show');
      }
    });
    btn.on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({scrollTop:0}, '300');
    });

    //Placeholder show/hide
    $('input, textarea').focus(function () {
        $(this).data('placeholder', $(this).attr('placeholder'));
        $(this).attr('placeholder', '');
    });
    $('input, textarea').blur(function () {
        $(this).attr('placeholder', $(this).data('placeholder'));
    });

    // Projects Page
    var gallery = $('.cd-gallery'),
    foldingPanel = $('.cd-folding-panel'),
    mainContent = $('.cd-main');
    /* open folding content */
    gallery.on('click', 'a', function(event){
        event.preventDefault();
        openItemInfo($(this).attr('href'));
    });
    /* close folding content */
    foldingPanel.on('click', '.cd-close', function(event){
        event.preventDefault();
        toggleContent('', false);
    });
    gallery.on('click', function(event){
        /* detect click on .cd-gallery::before when the .cd-folding-panel is open */
        if($(event.target).is('.cd-gallery') && $('.fold-is-open').length > 0 ) toggleContent('', false);
    })
    function openItemInfo(url) {
        var mq = viewportSize();
        if( gallery.offset().top > $(window).scrollTop() && mq != 'mobile') {
            /* if content is visible above the .cd-gallery - scroll before opening the folding panel */
            $('body,html').animate({
                'scrollTop': gallery.offset().top
            }, 100, function(){ 
                toggleContent(url, true);
            }); 
        } else if( gallery.offset().top + gallery.height() < $(window).scrollTop() + $(window).height()  && mq != 'mobile' ) {
            /* if content is visible below the .cd-gallery - scroll before opening the folding panel */
            $('body,html').animate({
                'scrollTop': gallery.offset().top + gallery.height() - $(window).height()
            }, 100, function(){ 
                toggleContent(url, true);
            });
        } else {
            toggleContent(url, true);
        }
    }
    function toggleContent(url, bool) {
        if( bool ) {
            /* load and show new content */
            var foldingContent = foldingPanel.find('.cd-fold-content');
            foldingContent.load(url+' article.center-relative > *', function(event){
                setTimeout(function(){
                    $('body').addClass('overflow-hidden');
                    foldingPanel.addClass('is-open');
                    mainContent.addClass('fold-is-open');
                }, 100);
                
            });
        } else {
            /* close the folding panel */
            var mq = viewportSize();
            foldingPanel.removeClass('is-open');
            mainContent.removeClass('fold-is-open');
            
            (mq == 'mobile' || $('.no-csstransitions').length > 0 ) 
                /* according to the mq, immediately remove the .overflow-hidden or wait for the end of the animation */
                ? $('body').removeClass('overflow-hidden')
                
                : mainContent.find('.cd-item').eq(0).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                    $('body').removeClass('overflow-hidden');
                    mainContent.find('.cd-item').eq(0).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
                });
        }
        
    }
    function viewportSize() {
        /* retrieve the content value of .cd-main::before to check the actua mq */
        return window.getComputedStyle(document.querySelector('.cd-main'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
    }

    // TODO: searchJSON.JS 

});

jQuery(window).resize(function ($) {

    var count = 0;
    var scrollItemWidth = $('.cbp-bislideshow.scroll li').outerWidth();
    $('#cbp-bislideshow.scroll').children('li').each(function () {
        var $item = $(this);
        $item.css({ 'left': count * scrollItemWidth });
        count++;
    });

});

//------------------------------------------------------------------------
// PhotoSwipe Initialize -->
//------------------------------------------------------------------------

var initPhotoSwipeFromDOM = function (gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    parseThumbnailElements = function (el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {

            if (thumbElements[i].nodeName == 'FIGURE') {
                figureEl = thumbElements[i]; // <figure> element

                // include only element nodes 
                if (figureEl.nodeType !== 1) {
                    continue;
                }

                linkEl = figureEl.children[0]; // <a> element

                size = linkEl.getAttribute('data-size').split('x');

                // create slide object
                item = {
                    src: linkEl.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };

                if (figureEl.children.length > 1) {
                    // <figcaption> content
                    item.title = figureEl.children[1].innerHTML;
                }

                if (linkEl.children.length > 0) {
                    // <img> thumbnail element, retrieving thumbnail url
                    item.msrc = linkEl.children[0].getAttribute('src');
                }

                item.el = figureEl; // save link to element for getThumbBoundsFn
                items.push(item);
            }
        }
        return items;
    };

    // find nearest parent element
    closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    // triggers when user clicks on thumbnail
    onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if (!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }

        if (index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe(index, clickedGallery);

        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
            params = {};

        if (hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function (index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            }

        };

        // PhotoSwipe opened from URL
        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
            return;
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

};

// execute above function
initPhotoSwipeFromDOM('.post-gallery');
