var accountClipboardEventHandler = function(e) {
    copyAddress();

    function copyAddress() {
         var copyTextarea = document.querySelector('.copyable-address input#address');
        console.log(copyTextarea);
        copyTextarea.select();
        document.execCommand("copy");
        document.querySelector('.tick').style.display = "inline-block";
    }


}


Template['views_receive'].helpers({

  address: function(){
         return FlowRouter.getParam('address');
  },

  balance:function(){
    return FlowRouter.getParam('balance');
  }

})


Template['views_receive'].events({
/**
Click to copy the code to the clipboard

@event click a.create.account
*/

'click .copy-to-clipboard-button': accountClipboardEventHandler,

/**
Tries to copy account token.

@event copy .copyable-address span
*/
'copy .copyable-address': accountClipboardEventHandler,

});
