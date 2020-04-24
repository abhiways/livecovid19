$(function(){
    function pageLoad(){

        /* Sparklines can also take their values from the first argument
         passed to the sparkline() function */
        function randomValue(){
            return Math.floor( Math.random() * 40 );
        }
        var values = [[],[],[],[],[]],
            options = {
                width: '150px',
                height: '30px',
                lineColor: $white,
                lineWidth: '2',
                spotRadius: '2',
                highlightLineColor: $gray,
                highlightSpotColor: $gray,
                spotColor: false,
                minSpotColor: false,
                maxSpotColor: false
            };
        for (var i = 0; i < values.length; i++){
            values[i] = [10 + randomValue(), 15 + randomValue(), 20 + randomValue(), 15 + randomValue(), 25 + randomValue(),
                25 + randomValue(), 30 + randomValue(), 30 + randomValue(), 40 + randomValue()]
        }

        function drawSparkLines(){
            options.lineColor = $green;
            options.fillColor = 'rgba(86, 188, 118, 0.1)';
            $('#direct-trend').sparkline(values[0], options );
            options.lineColor = $orange;
            options.fillColor = 'rgba(234, 200, 94, 0.1)';
            $('#refer-trend').sparkline(values[1], options );
            options.lineColor = $blue;
            options.fillColor = 'rgba(106, 141, 167, 0.1)';
            $('#social-trend').sparkline(values[2], options );
            options.lineColor = $red;
            options.fillColor = 'rgba(229, 96, 59, 0.1)';
            $('#search-trend').sparkline(values[3], options );
            options.lineColor = $white;
            options.fillColor = 'rgba(255, 255, 255, 0.1)';
            $('#internal-trend').sparkline(values[4], options );
        }

        drawSparkLines();

        PjaxApp.onResize(drawSparkLines);


        // Notification link click handler.
        // JUST FOR DEMO.
        // Can be removed.

        function close(e){
            var $settings = $("#settings"),
                $popover = $settings.siblings(".popover");
            if($popover.length && !$.contains($popover[0], e.target)){
                $settings.popover('hide');
                $(document).off("click", close);
            }
        }
        $("#notification-link").click(function(){
            if ( $(window).width() > 767){
                $("#settings").popover('show');
                $(document).on("click", close);
                return false;
            }
        });

        $("#feed").slimscroll({
            height: 'auto',
            size: '5px',
            alwaysVisible: true,
            railVisible: true
        });

        $("#chat-messages").slimscroll({
            height: '240px',
            size: '5px',
            alwaysVisible: true,
            railVisible: true
        });

        $('.widget').widgster();

        (function timeAgo(selector) {

            var templates = {
                prefix: "",
                suffix: " ago",
                seconds: "less than a minute",
                minute: "about a minute",
                minutes: "%d minutes",
                hour: "about an hour",
                hours: "about %d hours",
                day: "a day",
                days: "%d days",
                month: "about a month",
                months: "%d months",
                year: "about a year",
                years: "%d years"
            };
            var template = function(t, n) {
                return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
            };
        
            var timer = function(time) {
                if (!time)
                    return;
                time = time.replace(/\.\d+/, ""); // remove milliseconds
                time = time.replace(/-/, "/").replace(/-/, "/");
                time = time.replace(/T/, " ").replace(/Z/, " UTC");
                time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
                time = new Date(time * 1000 || time);
        
                var now = new Date();
                var seconds = ((now.getTime() - time) * .001) >> 0;
                var minutes = seconds / 60;
                var hours = minutes / 60;
                var days = hours / 24;
                var years = days / 365;
        
                return templates.prefix + (
                        seconds < 45 && template('seconds', seconds) ||
                        seconds < 90 && template('minute', 1) ||
                        minutes < 45 && template('minutes', minutes) ||
                        minutes < 90 && template('hour', 1) ||
                        hours < 24 && template('hours', hours) ||
                        hours < 42 && template('day', 1) ||
                        days < 30 && template('days', days) ||
                        days < 45 && template('month', 1) ||
                        days < 365 && template('months', days / 30) ||
                        years < 1.5 && template('year', 1) ||
                        template('years', years)
                        ) + templates.suffix;
            };
        
            var elements = document.getElementsByClassName('timeago');
            for (var i in elements) {
                var $this = elements[i];
                if (typeof $this === 'object') {
                    $this.innerHTML = timer($this.getAttribute('title') || $this.getAttribute('datetime'));
                }
            }
            // update time every minute
            setTimeout(timeAgo, 60000);
        
        })();
    }

    pageLoad();

    PjaxApp.onPageLoad(pageLoad);
});