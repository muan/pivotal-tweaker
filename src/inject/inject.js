chrome.extension.sendRequest({}, function(settings) {
	var readyStateCheckInterval = setInterval(function() {
  if(!!document.getElementById("layout")) {
		clearInterval(readyStateCheckInterval);

    function Tweaker () {
      this.init();
      this.initHeader();
      this.appendControls( this.getListOfUsers() );
      this.checkDOMChangesForResetting();
    }

    Tweaker.prototype.checkDOMChangesForResetting = function() {
      var tweaker = this;

      $("#layout > tbody > tr").first().bind( "DOMNodeRemoved DOMNodeRemovedFromDocument", function() {
        if ( $("#layout > tbody > tr").length > 1 ) {
          var reset = setInterval( function() {
            var panel = $("#layout > tbody > tr");
            if ( panel.length == 1 && panel.is(":visible") ) {
              tweaker.resetAll();
              tweaker.appendControls( tweaker.getListOfUsers() );
              clearInterval( reset );
            }
          }, 200);
        }
      });

    };

    Tweaker.prototype.init = function() {
      var tweaker = this;
      tweaker.current_user = document.getElementsByTagName("head")[0].innerHTML.split(",\"name\":\"")[1].split("\"")[0];
      console.log("You are " + tweaker.current_user + ". This is Pivotal Tweaker. ♥");

      // create tweaker dropdown
      tweaker.wrapper = $('<li class="tweaker_menu ready dropdown_menu main_menu copyin_toggle"></li>');
      $("#buttonPanel").append( tweaker.wrapper );
      
      // tweaker styling
      tweaker.css = $("<style rel=custom></style>");
      $("head").append( tweaker.css );

      // this is user menu
      tweaker.menu = $("<div class='toggle_user_menu toggle_menu'></div>");
      tweaker.wrapper.append( tweaker.menu );
      
    };

    Tweaker.prototype.getListOfUsers = function() {
      var tweaker = this;
      var users = [];
      $("a.storyOwnerInitials").each( function() {
        users.push($(this).attr("title"));
      });
      users.push("Show All");
      users = _.uniq(users);
      return users;
    };

    Tweaker.prototype.resetAll = function() {
      var tweaker = this;
      $(".copyin").remove();
      tweaker.css.html("");
    }

    Tweaker.prototype.appendControls = function(users) {
      var tweaker = this;

      if ( settings.dropdownOn ) { 
        tweaker.bindToggleStoriesForAllMembers(users); 
      } else {
        tweaker.bindToggleStoriesForCurrentUser(users); 
      }
      if ( settings.tagOn ) { tweaker.giveUsersTags(users); }
      if ( settings.showUnassigned ) { tweaker.bindUnassignedStories(); }
      if ( settings.requesters ) { tweaker.appendRequesterControls(users); }
    }

    Tweaker.prototype.bindToggleStoriesForAllMembers = function(users) {
      var tweaker = this;
        
      tweaker.wrapper.append($("<a class='tab copyin button' href='#'>Toggle Stories</a>"));
      
      $.each(users, function(index, value) {
        tweaker.menu.append($("<a href='#' class='copyin owner_c' title='" + value + "'>" + value + "</a>"));
        
        $("a.owner_c[title='" + value + "']").click( function() {
          
          if ( settings.effectOn ) { 
            $(".item[id*='itemList_story']").slideDown();
           } else {
            $(".item[id*='itemList_story']").show();
          }

          $("a.show_unassigned").removeClass("reset");

          if ( value != "Show All") {
            if ( settings.effectOn ) {
              $(".item[id*='itemList_story']:not(:has(a[title='" + value + "']))").slideToggle();
            } else {
              $(".item[id*='itemList_story']:not(:has(a[title='" + value + "']))").toggle();
            }
          }

        });
      });
    }

    Tweaker.prototype.bindToggleStoriesForCurrentUser = function(users) {
      var tweaker = this;

      tweaker.wrapper.removeClass("dropdown_menu");
      tweaker.wrapper.append($("<a class='toggle_current_user button copyin' href='#'>My Stories</a>"));
      $("a.toggle_current_user").click(function() {

        if ( $("a.show_unassigned").hasClass("reset") ) { $("a.show_unassigned").click(); }

        if ( settings.effectOn ) {
          $(".item[id*='itemList_story']:not(:has(a[title='" + current_user + "']))").slideToggle();
        } else {
          $(".item[id*='itemList_story']:not(:has(a[title='" + current_user + "']))").toggle();
        }

      });
    }

    Tweaker.prototype.bindUnassignedStories = function() {
      var tweaker = this;

      // Add in unassigned button in different places based on dropdown setting
      if ( settings.dropdownOn ) {
        tweaker.menu.append($('<a class="divider copyin"></li>'));
        tweaker.menu.append($('<a class="show_unassigned copyin" href="#">&nbsp;</li>'));
      } else {
        $("#buttonPanel").append($('<li class="main_menu copyin"><a class="tab button show_unassigned" href="#">&nbsp;</li>'));
      }

      $("a.show_unassigned").click(function() {
        $(this).toggleClass("reset");

        if ($(this).hasClass("reset")) {
          $(".item[id*='itemList_story']").hide();
          if ( settings.effectOn ) {
            $(".item[id*='itemList_story']:not(:has(a.storyOwnerInitials))").slideToggle();
          } else {
            $(".item[id*='itemList_story']:not(:has(a.storyOwnerInitials))").toggle();
          }
        } else {
          $(".item[id*='itemList_story']").show();
        }
      });
    }

    Tweaker.prototype.appendRequesterControls = function ( users ) {
      var tweaker = this;
      $("#buttonPanel").append( '<li class="tweaker_menu_for_requsters dropdown_menu main_menu copyin_toggle"><div class="toggle_menu toggle_requster_menu"></div></li>' );
      tweaker.requester_btn = $("<a class='tab copyin button' href='#'>Requesters</a>");
      tweaker.requester_menu = $(".toggle_requster_menu");
      $(".tweaker_menu_for_requsters").append( tweaker.requester_btn );
      tweaker.requester_btn.click( function() {
        tweaker.loadRequesters( users );
      });
    }

    Tweaker.prototype.loadRequesters = function( users ) {
      var tweaker = this;
      var allStories = $(".storyItem");
      var i = 0;
      
      tweaker.requester_btn.unbind("click");
      $("#buttonPanel").append("<li class=\"loading_req\">Loading <span class=\"count_req\">" + i + "</span>/" + allStories.length + "</li>");

      var checkRequesterOnebyOne = function() {
        element = $(allStories[i]);
        element.find(".toggleExpandedButton").click();
        requester = element.find("select.requester option:selected").text();
        requesterInitial = $("a.storyOwnerInitials[title='" + requester + "']").first().text().split("/")[0];
        if( requesterInitial ) {
          element.attr("data-requester", requester );
          element.find("a.storyOwnerInitials").append("<span>/"+requesterInitial+"</span>");
        }
        element.find(".toggleExpandedButton").click();
        i++
        $(".count_req").html(i);
        
        if (i == allStories.length) { 
          clearInterval(check); 
          $(".loading_req").remove(); 
          $(".tweaker_menu_for_requsters").addClass("ready");
        }
      }
      var check = setInterval( function() {
        checkRequesterOnebyOne(); }
      , 50 );


      $.each(users, function(index, value) {
        if ( value != "Show All") {
          tweaker.requester_menu.append($("<a href='#' class='requester_c copyin' title='" + value + "'>" + value + "</a>"));
          $("a.requester_c[title='" + value + "']").click( function() {
            if ( settings.effectOn ) { 
              $(".storyItem[data-requester='" + value + "']").parents(".item").slideDown();
             } else {
              $(".storyItem[data-requester='" + value + "']").parents(".item").show();
            }

            if ( settings.effectOn ) {
              $(".storyItem:not([data-requester='" + value + "'])").parents(".item").slideUp();
            } else {
              $(".storyItem:not([data-requester='" + value + "'])").parents(".item").hide();
            }
          });
        }
      });

      var unassigned = $("<a href='#' class='requester_c copyin requester_unassigned'>Unassigned</a>");
      tweaker.requester_menu.append( unassigned );
      unassigned.click(function() {
        $(".item").show();
        $(".storyItem[data-requester]").parents(".item").slideUp();
      });

    };

    Tweaker.prototype.giveUsersTags = function(users) {
      var tweaker = this;
      var colourCombination = [
        ["#ecd537", "#000000"],
        ["#9d454d", "#ffffff"],
        ["#aaddee", "#000000"],
        ["#eb9500", "#ffffff"],
        ["#6c4281", "#ffffff"],
        ["#227479", "#ffffff"],
        ["#008833", "#ffffff"]
      ]

      $.each(users, function(index, value) {
        tweaker.css.append("\
          a.storyOwnerInitials[title='" + value + "'] {\
            background-color: " + colourCombination[index][0] + ";\
            color: " + colourCombination[index][1] + ";\
          }\
        ");
      });

      if( settings.userBgColour ) {
        tweaker.css.append(".item a[title='" + current_user + "'] { background-color: " + settings.userBgColour + " }");
      }
      if( settings.userTextColour ) {
        tweaker.css.append(".item a[title='" + current_user + "'] { color: " + settings.userTextColour + " }");
      }

      var tagcss = "a.storyOwnerInitials {";

      if( settings.tagInline ) {
        tagcss = tagcss + "display: inline;";
      } else {
        tagcss = tagcss + "display: block; position: absolute;";
      }

      tagcss = tagcss + "\
        font-style: normal !important;\
        font-size: 10px;\
        line-height: : 10px;\
        height: 16px;\
        text-align: center;\
        border-radius: 3px;\
        margin-left: 4px;\
        font-weight: 600;\
        margin-top: -17px;\
        padding: 0 4px;\
        color: #000;\
        width: auto;\
        left: 0;\
        }";

      tweaker.css.append(tagcss);
    }

    Tweaker.prototype.initHeader = function(argument) {
      $("body").append("<div id=\"tongue\" class=\"copyin\"></div>");
      $("#tongue").click( function() {
        $("#header, #tongue").toggleClass("expanded");
      } );
    }

    var PivotalTweaker = new Tweaker();



  }
	}, 1000);
});