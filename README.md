# Vimeo: Interactive Fiction WebGL Prototype 

##  Concept

This project aims to provide a simple front-end interface that lets users create an interactive, "choose-your-own-adventure" style VR experience with near-zero effort. This minimum-viable demonstration exposes a React component, **VimeoInteractiveFiction**, which accepts as its property a simple Javascript object which describes in ⭐️judicious brevity⭐️ all the data needed to render a simple interactive fiction project with minimual setup. 

At a much higher level, my goal was to:

* Ideate a concept that Vimeo could use in a real-world product or feature
* Build on and extend, rather than merely implement, the existing work from Creator Labs,
* Develop a simple (but highly functional demo) that could be shopped to Vimeo staff as part of a proof-of-concept or proposal to secure funding for Creator Labs work in the  future 
* Demonstrates thinking and a development approach that holds internal stakeholders, external developers, and creative content makers in mind all at once

## Setup/Install

* Open the application folder and run ```npm install```. 
* As in the original demo, set the ```VIMEO_TOKEN``` environment variable for an account that the user owns. 
* In the ```app/demo.ja``` file, replace all vimeo URLs with videos for which the user has an access token. There are three by deafult in this prototype but more may be added at will as long as the structure of the _settings_ property is maintained
* run ```npm start``` and check view ```localhost``` at whatever port the terminal spits out (or is set in the ```PORT``` environment variable)


## Usage

* On load, a video will autoplay (in 360, if possible). 
* After a short pause, a green cube will appear. After a small while (~6 seconds by default), another one will show up. 
* Use the "gaze" target (the little black circle at the very center of the screen) to point at one of the cubes. Right now this is all using A-Frame's gaze cursor and events, so just clicking when the target isn't centered won't do.
* Click anywhere. As long as the gaze target is on one of the green cubes, the scene will change

Tested on Windows in the latest versions of FireFox and Chrome in a local environment. Mobile support and Glitch deployment are, for the moment, totally untested.

## API Overview

The main entry point is the **VimeoInteractiveFiction** component, which encapsulates the entire A-Frame scene and business logic for loading Vimeo content, displaying markers which allow the end-user to click through to other sections, and switching one scene for another. All setup occurs in the ```settings``` property of the **VimeoInteractiveFiction** component, whose function and structure are described below. 

### VimeoInteractiveFiction Example Properties

```javascript
// The entire map is encapsulated in a single property object called 'settings'. Below is an example of a full, working settings object that switches between three scenes 

{
    // Each scene is an object in one big, all-encompassing array
    // Don't forget to wrap this array in curly braces so React can read it
    [
        // Each member of the Settings array is an anonymous object 
                {
                    // Each object has two properties: 'url' and 'markers'
                    // 'url' is a string which points to a Vimeo video
                    url: "https://vimeo.com/258521329",
                    // 'markers' is an array of anonymous objects which
                    // describe how and when to transition from scene to scene
                     markers: [
                        {
                            // 'targetIndex' is the index of the video to play if this marker is clicked
                            // Here we will move to the second video in the settings array
                            targetIndex: 1,
                            // This is the posiition in the A-Frame scene of the marker
                            position: "5 4 -5",
                            // Markers should not appear until the user needs 
                            // to decide what to do next. 'triggerTime' represents the 
                            // delay in seconds before the market is shown from when its
                            // scene is loaded 
                            triggerTime: 2
                        },
                        {
                            // Another marker, with its own settings
                            targetIndex: 2, // Go to the third video
                            position: "-5 2 -5", // Set the marker position
                            triggerTime: 8 // Wait 8 seconds before showing
                        }
                    ]
                },
                // Now another video, and config settings for all its markers
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
```

In the example above, three videos are loaded into the ```settings``` property. Markers (simple green cubes, in this demo) will appear after the delay specified in each marker's definition. Upon being clicked, the scene will load the video at the ```settings``` index described in that particular marker's ```targetIndex``` propery. 

This demo links all three scenes together, so the user will just bounce endlessly between them. 


## Architecture

#### Application Entry

Most of the A-Frame scene settings have been migrated into the **VimeoInteractiveFiction** component. Although the **Demo** component from the original example remains the entry point for the application, its render function now returns only the **VimeoInteractiveFiction** component with example properties fed in. 

#### VimeoInteractiveFiction Component

The **VimeoInteractiveFiction** component renders a full A-Frame scene, and is mainly used as a state machine to administer each configuration described in its ```settings``` property. It retains only one piece of state: an integer named _curIndex_ which is tells which video (and set of markers) to render. Think of ```curIndex``` and the single source of truth for the state of the application. When this changes, the whole A-Frame scene re-mounts with new data.

#### Vimeo Component

The **Vimeo** comonent has been modified slightly; it now adds ```props.children``` to the array returned from from the ```render()``` function. This allows us to pass **SceneMarker** components in as children of the Vimeo object. 

#### SceneMarker Component

Each **SceneMarker** represents a link to the next scene. For now, each marker is hard-coded to be a green box rendered by A-Frame. The marker begins a timer upon instantiation, and will return ```null``` out of its ```render()``` function until that timer passes the trigger time specified in interactive fiction components's settings property. This lets the developer only expose controls to a user at the appropriate time in the video.


## Hacks, Hacks, Hacks

It wouldn't be a prototype without some good old-fashioned hacks. Here are some challenges I faced while developing this demo, and the clever/horrible things I did to get around them quickly.

#### Hack 1 : Getting A-Frame events into React

I'll admit, I thought this was going to be easier. The goal was to update a VimeoInteractiveFiction component's state when a user clicked on a marker. It's easy enough to bubble a notification from React component to React component, but although the **SceneMarker** component is effectively a wrapper around an ```<a-box />``` with an extra layer of business logic, the event comes from A-Frame and is not so straightforwardly bubbled up to a specific instance of a react component. 

The first step was creating an ```onSceneChange()``` function inside the main **VimeoInteractiveFiction** component. This is bound to ```this``` on initialization, so the correct instance state could be accessed even if it was called from another context. This is effectively a hook that allows us to enter React from an external event, such as those produced by the A-Frame component. We could have applied this a little closer down to the A-Frame component and bubbled the event up in React, but I opted to go straight to the target and make room for events in the scene container directly. 

Unfortunately, the A-Frame component which must detect clicks and dispatch correspoonding events has no easy way to access the React **SceneMarker** component that is rendering it-- but it must gain access to _that_ marker's ```targetIndex``` property in order to tell the **VimeoInteractiveFiction** component what scene to swap to. Rather than build any more complexity into this process, I simply loaded the React component's ```targetIndex``` property into a data attribute when instantiating the A-Frame component in the first place, and read it back out of the DOM when the event fires. A little bit roundabout, but quick and effective!

#### Hack 2: Re-mount the scene instead of updating the components

I was having trouble getting the A-Frame components responsible for rendering the video to perform correctly when React was diffing out the Vimeo component, so I needed to brute-force a full refresh. At first I tried forcing the just the Vimeo component to remount by setting its ```key``` to the URL of the video it was displaying, but this didn't seem to help at first blush, and in the name of expediency on a such a short turnaround I decided to just remount the entire scene. I generally prefer to step out of, rather than into rabbit holes, especially when moving quickly for a minimum viable product.

#### Hack 3: Re-Binding A-Frame's Event Target 

Hack 2 introduced a new bug-- the scene which A-Frame had bound its event dispatch no longer existed. This was solved easily enough by moving the declaration of the A-Frame ```cursor-listener``` attribute into the initialization of the scene, re-affirming it when the scene changed, and deleting it entirely when the scene container unmounts. This had some nice externalities, as it packed the lifecycle of the A-Frame component into the lifecycle of the **VimeoInteractiveFiction** component, thus eliminating a potentially hazardous external dependency in the form of an A-Frame component that would otherwise be loaded in a separate script.  



## Roadmap

We've got a long way to go. Here are some short-term goals for where to take this

1. Preload all linked videos upon scene entry
    * Loading is only bad if you know it's happening
2. Swap texture instead of reloading entire objects
    * This should make for totally seamless transitions
3. Improve time synchonization
    * Right now marker timers start as soon as the markers are loaded, but on poor connections you can notice the markers loading too early, as their timers will fall out of sync with the Vimeo video. 
    * Circumvent this by, for example, synchonizing the timer clocks to the video play events-- or having them read the video time directly. 
4. Custom and extensible markers
    * People should be able to style and animate these, however they like, and easily
3. Split the whole project into two-- a set of A-Frame Components and a set of React-VR components
    * Although mixing the two worked for setup and playback, a lot of complexity could be removed from the interactive version of this by making a clean split
