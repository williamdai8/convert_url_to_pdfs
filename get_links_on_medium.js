function updateLinksAsBookmarked() {
    var links = document.getElementsByClassName("button button--dark button--chromeless is-touchIconFadeInPulse u-baseColor--buttonDark button--withIcon button--withSvgIcon button--withIcon button--withSvgIcon button--bookmark js-bookmarkButton")
   
      if (links.length > 1) {
          for(var i=0; i<links.length; i++) {
              try {
                if(links[i].getAttribute("data-action") == "add-to-bookmarks") {
                  links[i].click()
                }
              } catch (err) {
               console.log('Error has occurred: ' + err)
              }
          }
      } 
      else {
          console.log('No links found on page')
      }
  }
 
 
function getOnlyNotBookmarkedLinks() {
    var bookmark_buttons = document.getElementsByClassName("button button--dark button--chromeless is-touchIconFadeInPulse u-baseColor--buttonDark button--withIcon button--withSvgIcon button--withIcon button--withSvgIcon button--bookmark js-bookmarkButton")
    var links = document.getElementsByClassName("ds-link ds-link--stylePointer u-width100pct")
    var not_bookmarked_list = [];
 
      if (bookmark_buttons.length > 1) {
          for(var i=0; i<bookmark_buttons.length; i++) {
              try {
                if(bookmark_buttons[i].getAttribute("data-action") == "add-to-bookmarks") {
                  if(bookmark_buttons[i].getAttribute("disabled") == null) {
                    not_bookmarked_list.push(bookmark_buttons[i].getAttribute("data-action-value"))
                  }
                }
              } catch (err) {
                console.log('Error has occurred: ' + err)
              }
          }
      } 
      else {
          console.log('No links found on page')
      }
 
      for(var i=0; i<links.length; i++) {
        if(not_bookmarked_list.indexOf(links[i].getAttribute("data-post-id")) > -1) {
          console.log(links[i].href + "\n")
        }
      }
}

//^\n|^.+http|http
//http