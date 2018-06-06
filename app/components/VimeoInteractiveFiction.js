/* eslint-disable */

const React = require('react');
const ReactDOM = require('react-dom');
const Vimeo = require('./Vimeo');
const SceneMarker = require('./SceneMarker');

class VimeoInteractiveFiction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            curIndex: 0
        };

        // Bind tbe callback 'this' to the current instance of the react component
        this.onSceneChange = this.onSceneChange.bind(this);
    }

    componentDidMount() {
        // We have to re-bind this whenever we refresh the scene, so this is a hack to re-register
        // the a-frame callbacks when we re-instantiate the scene
        AFRAME.registerComponent('cursor-listener', {

            schema: {
                targetIndex: {
                    type: 'int',
                    default: 0
                }
            },

            init: function () {
                this.el.addEventListener('click', function (evt) {
                    var event = new CustomEvent('vimeoscenechange', {detail: parseInt(evt.currentTarget.dataset.targetindex)});
                    document.getElementById("vimeoscene").dispatchEvent(event);
                });
            }


        });
        this.reregisterSceneCallbacks();
    }


    reregisterSceneCallbacks() {
        // A hack to let A-Frame broadcast click data into React
        // Calls when the scene is reloaded
        // ReactDOM.findDOMNode(this).removeAllListeners();
        ReactDOM.findDOMNode(this).addEventListener('vimeoscenechange', this.onSceneChange);
    }

    componentWillUnmount() {
        // Remove the A-Frame component for the marker clicks when we unmount this React component
        delete AFRAME.components['cursor-listener'];
    }

    onSceneChange(evt) {
        console.log("Switching to scene " + evt.detail);
        this.setState(
            (prevState) => {
                return {
                    curIndex: evt.detail
                }

            }
        )
    }


    componentDidUpdate() {
        // Make sure the callbacks are on order when the scene is ready to call an update
        this.reregisterSceneCallbacks();
    }

    render() {
        // Ready up an array of markers from the current component state
        const markers = this.props.settings[this.state.curIndex].markers.map((item, index) => {
            return <SceneMarker triggerTime={item.triggerTime} position={item.position} targetIndex={item.targetIndex} key={item.pos}/>
        });

        // Grab the url for the current state
        const url = this.props.settings[this.state.curIndex].url;

        // Build a simple scene with an environment, a Vimeo player, and all the scene markers
        return (
            <a-scene id="vimeoscene" key={this.state.curIndex} >

                {/*Dynamic Scene Adjustments*/}
                {/*We use the url as a UID for React's 'key' property, forcing a full remount when the key changes*/}
                <Vimeo url={url} position="0 3 -15">
                    {markers}
                </Vimeo>


                {/* Boilerplate Scene Resources, a camera and cursor*/}
                <a-camera position="0 0 0">
                    <a-cursor visible="true"></a-cursor>
                </a-camera>
            </a-scene>
        );

    }

}

module.exports = VimeoInteractiveFiction;
