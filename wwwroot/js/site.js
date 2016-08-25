var App = function () {
    var terminalHubProxy = null;
    var globalTerm = null;

    $.connection.terminalHub.client.message = function (message) {
        console.log(message);
        if (message != null || message != '')
        globalTerm.echo(message);
    }

    $.connection.terminalHub.client.onConnect = function (object) {
        App.initTerminal(object);
        console.log(object);
    }

    return {
        onReceive: function (command, uid) {
            this.terminalHubProxy.server.receive(command, uid);
        },
        initTerminal: function (message) {
            $(function ($, undefined) {
                $('#term_demo').terminal(function (command, term) {
                    globalTerm = term;
                    if (command !== '') {
                        try {
                            self.onReceive(command, $.connection.hub.id);
                        } catch (e) {
                            term.error(new String(e));
                        }
                    } else {
                        term.echo('');
                    }
                }, {
                        greetings: message.greetings,
                        name: 'js_demo',
                        height: 400,
                        prompt: message.prompt
                    });
            });
        },


        init: function () {
            self = this;

            self.terminalHubProxy = $.connection.terminalHub;
            self.onMessage = self.terminalHubProxy.client.message;


            $.connection.hub.start()
                .done(function () {

                    console.log();
                    //globalTerm.echo("connected");
                })
                .fail(function () { console.log('Could not Connect!'); })
        }
    }
} ();

App.init();