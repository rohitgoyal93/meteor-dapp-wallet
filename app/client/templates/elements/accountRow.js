/**
Template Controllers

@module Templates
*/

/**
The account template

@class [template] elements_account
@constructor
*/

/**
Block required until a transaction is confirmed.

@property blocksForConfirmation
@type Number
*/
var blocksForConfirmation = 12;

var elementAddress;

var accountClipboardEventHandler = function(addressId){
    // if (Session.get('tmpAllowCopy') === true) {
    //     Session.set('tmpAllowCopy', false);
    //     return true;
    // }
    // else {
    //     e.preventDefault();
    // }

    // copyAddress();

    function copyAddress(){
        var copyTextarea = document.getElementById(addressId);
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(copyTextarea);
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');

            GlobalNotification.info({
               content: 'i18n:wallet.accounts.addressCopiedToClipboard',
               duration: 3
            });
        } catch (err) {
            GlobalNotification.error({
                content: 'i18n:wallet.accounts.addressNotCopiedToClipboard',
                closeable: false,
                duration: 3
            });
        }
        selection.removeAllRanges();
    }

    copyAddress();

    // if (Helpers.isOnMainNetwork()) {
    //     Session.set('tmpAllowCopy', true);
    //     copyAddress();
    // }
    // else {
    //     EthElements.Modal.question({
    //         text: new Spacebars.SafeString(TAPi18n.__('wallet.accounts.modal.copyAddressWarning')),
    //         ok: function(){
    //             Session.set('tmpAllowCopy', true);
    //             copyAddress();
    //         },
    //         cancel: true,
    //         modalQuestionOkButtonText: TAPi18n.__('wallet.accounts.modal.buttonOk'),
    //         modalQuestionCancelButtonText: TAPi18n.__('wallet.accounts.modal.buttonCancel')
    //     });
    // }
};


Template['elements_accountRow'].rendered = function(){

    // initiate the geo pattern
    var pattern = GeoPattern.generate(this.data.address);
    this.$('.account-pattern').css('background-image', pattern.toDataUrl());
};


Template['elements_accountRow'].helpers({
    /**
    Get the current account

    @method (account)
    */

    'elementId' : function(){
      return elementAddress;
    },

    'account': function(){
      var accountInfo = EthAccounts.findOne(this.account) || Wallets.findOne(this.account) || CustomContracts.findOne(this.account);
      elementAddress = accountInfo.address;
      return accountInfo;
    },
    /**
    Get all tokens

    @method (tokens)
    */
    'tokens': function(){
        var query = {};
        query['balances.'+ this._id] = {$exists: true};
        return Tokens.find(query, {limit: 5, sort: {name: 1}});
    },
    /**
    Get the tokens balance

    @method (formattedTokenBalance)
    */
    'formattedTokenBalance': function(e){
        var account = Template.parentData(2);

        return (this.balances && Number(this.balances[account._id]) > 0)
            ? Helpers.formatNumberByDecimals(this.balances[account._id], this.decimals) +' '+ this.symbol
            : false;
    },
    /**
    Get the name

    @method (name)
    */
    'name': function(){
        return this.name || TAPi18n.__('wallet.accounts.defaultName');
    },
    /**
    Account was just added. Return true and remove the "new" field.

    @method (new)
    */
    'new': function() {
        if(this.new) {
            // remove the "new" field
            var id = this._id;
            Meteor.setTimeout(function() {
                EthAccounts.update(id, {$unset: {new: ''}});
                Wallets.update(id, {$unset: {new: ''}});
                CustomContracts.update(id, {$unset: {new: ''}});
            }, 1000);

            return true;
        }
    },
    /**
    Should the wallet show disabled

    @method (creating)
    */
    'creating': function(){
        return (!this.address || this.imported || (blocksForConfirmation >= EthBlocks.latest.number - (this.creationBlock - 1) && EthBlocks.latest.number - (this.creationBlock - 1) >= 0));
    },
    /**
    Returns the confirmations

    @method (totalConfirmations)
    */
    'totalConfirmations': blocksForConfirmation,
    /**
    Checks whether the transaction is confirmed ot not.

    @method (unConfirmed)
    */
    'unConfirmed': function() {
        if(!this.address || !this.creationBlock || this.createdIdentifier)
            return false;

        var currentBlockNumber = EthBlocks.latest.number,
            confirmations = currentBlockNumber - (this.creationBlock - 1);
        return (blocksForConfirmation >= confirmations && confirmations >= 0)
            ? {
                confirmations: confirmations,
                percent: (confirmations / (blocksForConfirmation)) * 100
            }
            : false;
    }
});

Template['elements_accountRow'].events({
    'click .copy-to-clipboard-button': function(){
      accountClipboardEventHandler(this.address);
    },
    /**
    Field test the speed wallet is rendered
    @event click button.show-data
    */
    'click .wallet-box': function(e){
        console.time('renderAccountPage');
    }
});
