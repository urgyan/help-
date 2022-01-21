class ToggleLike{
    constructor(toggleElement){
        this.toggler=toggleElement;
        this.toggleLike();
    }
    toggleLike(){
        // console.log(this);
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self=this;
            // console.log($(self).attr('href'));
            $.ajax({
                type:'POST',
                url:$(self).attr('href'),
            })
            .done(function(data){
                let attribute=`data-likes`;
                let likes=parseInt($(self).attr(attribute));
                if(data.data.deleted==true){
                    likes-=1;
                  
                    $(self).html(`<i class="like far fa-lg fa-thumbs-up">${likes}</i>`);
                }
                else
                {
                    likes+=1;
                    
                    $(self).html(`<i class="fas fa-lg fa-thumbs-up">${likes}</i>`);
                    
                }
                // console.log(likes);
                $(self).attr(attribute, likes);
                
               
              
            })
            .fail(function(err){
                console.log("Error in liking post/comment");
            })
        })
    }
}