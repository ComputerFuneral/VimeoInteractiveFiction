/* eslint-disable */

const React = require('react');
const ReactDOM = require('react-dom');
const VimeoInteractiveFiction = require('./components/VimeoInteractiveFiction');

class Demo extends React.Component {
    render() {
        return (
            <VimeoInteractiveFiction settings={[
                {
                    url: "https://vimeo.com/258521329",
                     markers: [
                        {
                            targetIndex: 1,
                            position: "5 4 -5",
                            triggerTime: 2
                        },
                        {
                            targetIndex: 2,
                            position: "-5 2 -5",
                            triggerTime: 8
                        }
                    ]
                },
                {
                    url: "https://vimeo.com/258523889",
                    markers: [
                        {
                            targetIndex: 0,
                            position: "3 4 -5",
                            triggerTime: 2
                        },
                        {
                            targetIndex: 2,
                            position: "-2 2 -5",
                            triggerTime: 8
                        }
                    ]
                },
                {
                    url: "https://vimeo.com/258523874",
                    markers: [
                        {
                            targetIndex: 0,
                            position: "1 4 -5",
                            triggerTime: 2
                        },
                        {
                            targetIndex: 1,
                            position: "2 2 -5",
                            triggerTime: 8
                        }
                    ]
                }

            ]}/>
        )
    }

}


module.exports = Demo;
ReactDOM.render(<Demo/>, document.getElementById('root'));