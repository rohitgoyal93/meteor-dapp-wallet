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
    hasAccounts: function() {
        var total = EthAccounts.find().count();
        if (total > 0) {
            return true;
        } else {
            return false;
        }
    },

    address: function() {
        var total = EthAccounts.find().count();
        if (total > 0) {
            var address = EthAccounts.findOne({
                address: web3.eth.coinbase
            });
            return address.address;
        } else {
            console.log("user has no account yet");
        }
    },

    balance: function() {
        var total = EthAccounts.find().count();
        if (total > 0) {
            var data = EthAccounts.findOne({
                address: web3.eth.coinbase
            });
            return parseFloat(data.balance).toFixed(6);
        } else {
            console.log("no balance yet::::");
        }
    },
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
