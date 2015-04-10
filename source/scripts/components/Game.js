var Loop = require("<scripts>/utilities/Loop")
var Phlux = require("<scripts>/utilities/Phlux")
var GameFrame = require("<scripts>/components/GameFrame")

var RobotStore = Phlux.createStore({
    data: {
        1: {
            robokey: 1,
            position: {
                x: 1,
                y: 2
            },
            width: 0.5,
            height: 0.5
        },
        2: {
            robokey: 2,
            position: {
                x: 3,
                y: 4
            },
            width: 0.5,
            height: 0.5
        },
        3: {
            robokey: 3,
            position: {
                x: 5,
                y: 6
            },
            width: 0.5,
            height: 0.5
        }
    },
    selectRobots: function(selection) {
        var selectings = []
        if(selection.alpha
        && selection.omega) {
            var x1 = Math.min(selection.alpha.x, selection.omega.x)
            var y1 = Math.min(selection.alpha.y, selection.omega.y)
            var x2 = x1 + Math.abs(selection.alpha.x - selection.omega.x)
            var y2 = y1 + Math.abs(selection.alpha.y - selection.omega.y)
            for(var key in this.data) {
                var robot = this.data[key]
                if(robot.position.x + (robot.width / 2) > x1
                && robot.position.x - (robot.width / 2) < x2
                && robot.position.y + (robot.height / 2) > y1
                && robot.position.y - (robot.height / 2) < y2) {
                    selectings.push(key)
                }
            }
        }
        return selectings
    }
})

var SelectionStore = Phlux.createStore({
    data: {
        robots: {},
        area: {}
    },
    onMouseDown: function(point, shift) {
        this.setAlphaPoint(point)
        this.trigger()
    },
    onMouseMove: function(point, shift) {
        this.setOmegaPoint(point)
        this.recalculateRobots()
        this.trigger()
    },
    onMouseUp: function(point, shift) {
        this.setOmegaPoint(point)
        this.recalculateRobots()
        this.resetPoints()
        this.trigger()
    },
    setAlphaPoint: function(point) {
        this.data.area.alpha = point
    },
    setOmegaPoint: function(point) {
        this.data.area.omega = point
    },
    resetPoints: function() {
        this.data.area = {}
    },
    recalculateRobots: function() {
        if(this.data.area.alpha && this.data.area.omega) {
            var robokeys = RobotStore.selectRobots(this.data.area)
            this.data.robots = {}
            for(var index in robokeys) {
                var robokey = robokeys[index]
                this.data.robots[robokey] = true
            }
        }
    }
})

var GameFrameStore = {
    getScale: function() {
        var html = document.getElementById("game-frame")
        var css = window.getComputedStyle(html)
        return Number(css.fontSize.match(/(\d+(\.\d+)?)px$/)[1])
    },
    getOffset: function() {
        var dom = document.getElementById("game-frame")
        return {
            x: dom.offsetLeft,
            y: dom.offsetTop
        }
    }
}

var Robot = require("<scripts>/components/Robot")
var SelectionArea = require("<scripts>/components/SelectionArea")

var Game = React.createClass({
    mixins: [
        Phlux.connectStore(RobotStore, "robots"),
        Phlux.connectStore(SelectionStore, "selection")
    ],
    render: function() {
        return (
            <GameFrame aspect-ratio="16x9">
                <RobotArmy robots={this.state.robots}
                    selection={this.state.selection.robots}/>
                <SelectionArea selection={this.state.selection.area}/>
                <InputLayer/>
            </GameFrame>
        )
    }
})

var RobotArmy = React.createClass({
    render: function() {
        return (
            <div>
                {this.renderRobots()}
            </div>
        )
    },
    renderRobots: function() {
        var renderings = new Array()
        for(var key in this.props.robots) {
            renderings.push(
                <Robot key={key} data={this.props.robots[key]}
                    selected={this.props.selection[key] != undefined}/>
            )
        }
        return renderings
    }
})

var InputLayer = React.createClass({
    render: function() {
        return (
            <div style={this.renderStyles()}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}/>
        )
    },
    renderStyles: function() {
        return {
            top: "0em",
            left: "0em",
            right: "0em",
            bottom: "0em",
            zIndex: "100",
            position: "fixed"
        }
    },
    onMouseDown: function(event) {
        var shift = event.shiftKey
        var point = {"x": event.clientX, "y": event.clientY}
        Phlux.triggerAction("MouseDown", this.rebase(point), shift)
    },
    onMouseMove: function(event) {
        var shift = event.shiftKey
        var point = {"x": event.clientX, "y": event.clientY}
        Phlux.triggerAction("MouseMove", this.rebase(point), shift)
    },
    onMouseUp: function(event) {
        var shift = event.shiftKey
        var point = {"x": event.clientX, "y": event.clientY}
        Phlux.triggerAction("MouseUp", this.rebase(point), shift)
    },
    rebase: function(point) {
        this.rebaseFromGameFrame(point)
        this.rebaseFromCamera(point)
        return point
    },
    rebaseFromGameFrame: function(point) {
        var scale = GameFrameStore.getScale()
        var offset = GameFrameStore.getOffset()
        point.x = (point.x - offset.x) / scale
        point.y = (point.y - offset.y) / scale
        return point
    },
    rebaseFromCamera: function(point) {
        return point
    }
})

module.exports = Game
