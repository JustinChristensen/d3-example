;(function (window, document, undefined) {

    function Gauge(config) {
        if (!(this instanceof Gauge)) {
            throw new TypeError();
        }

        this.constructor = Gauge;

        this.initialize(config);
    }

    Gauge.DEFAULTS = {
        width: 70,
        height: 280
    };

    Gauge.prototype = (function () {

        var π = Math.PI;
        var τ = π / 2;

        var arc = d3.svg.arc()
            .startAngle(-τ);

        var colorScale = d3.scale.linear();

        var tween = function (transition, newAngle) {
            transition.attrTween("d", function (d) {
                var interpolate = d3.interpolate(d.endAngle, newAngle);

                return function (t) {
                    d.endAngle = interpolate(t);
                    return arc(d);
                };
            });

            transition.styleTween("fill", function (d, i, fill) {
                return d3.interpolate(fill, colorScale(newAngle));
            });
        };

        return {

            initialize: function (config) {
                var radialDomain = [],
                    colorRange = [],
                    colors, i, len;

                this.config = $.extend({}, config, this.constructor.DEFAULTS);

                this.progress = this.config.progress;
                this.goal = this.config.goal;

                arc.outerRadius(this.config.height);
                arc.innerRadius(this.config.height - this.config.width);

                colors = this.config.colors;

                for (i = 0, len = colors.length; i < len; i++) {
                    radialDomain.push(colors[i][0] / 100 * π - τ);
                    colorRange.push(colors[i][1]);
                }

                colorScale.domain(radialDomain).range(colorRange);

                window.colorScale = colorScale;
            },

            render: function (container) {
                if (typeof container === "string") {
                    container = d3.select(container);
                }

                this.svg = container.append("svg")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .append("g")
                    .attr("transform", "translate(280,280)");

                this.svg.append("path")
                    .datum({ endAngle: τ })
                    .style("fill", "#ddd")
                    .attr("d", arc);

                this.foreground = this.svg.append("path")
                    .datum({ endAngle: 0 - τ })
                    .style("fill", colorScale(0 - τ))
                    .attr("d", arc);

                this.setProgress(this.config.progress);

                return this;
            },

            setProgress: function (progress) {
                this.progress = progress;
                this.updateGauge();
            },

            setGoal: function (goal) {
                this.goal = goal;
                this.updateGauge();
            },

            updateGauge: function () {
                this.foreground.transition()
                    .delay(250)
                    .duration(750)
                    .call(tween, (this.progress / this.goal) * π - τ);
            }

        };

    }());

    $(document).ready(function () {

        var gauge = new Gauge({
            progress: 50,
            goal: 1000,
            colors: [
                [0, "red"],
                [80, "orange"],
                [90, "yellow"],
                [100, "green"]
            ]
        });

        gauge.render("#arc");

        setTimeout(function () {
            gauge.setProgress(800);

            setTimeout(function () {
                gauge.setProgress(900);

                setTimeout(function () {
                    gauge.setProgress(1000);
                }, 1250);
            }, 1250);
        }, 1250);
    });

}(window, document));
