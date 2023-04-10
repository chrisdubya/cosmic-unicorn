import React, { useEffect, useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import Preview from './widgets/Preview';

import { useIdleTimer } from 'react-idle-timer'
import { defaultUnicornConfigs } from './config/config';
//import Settings from './widgets/Settings';

const randomInt = (min: number, max: number) => { 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const randomRgb = () => {
  return [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
};

let x = 0;
let y = 0;
let rgb = [2, 5, 0];
// const MAX_X = 53;
// const MAX_Y = 11;
const MAX_X = 32;
const MAX_Y = 32;
let socket: WebSocket | null = null;
let reconnect_counter = 0;

const unicornTypes = {
  cosmic: {
    width: 32,
    height: 32,
  },
  galactic: {
    width: 32,
    height: 32,
  },
};



const defaultIndex = 0;
const defaultUnicorn = defaultUnicornConfigs[defaultIndex];

interface FetchStateObject {
  isError: boolean;
  errorMessage: string;
  errorCount: number;
};
interface FetchStateType {
  [key: string]: FetchStateObject;
};

function App() {

  const [isConnectedDesired, setIsConnectedDesired] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  //const [selectedIp, setSelectedIp] = useState(defaultUnicorn.ip); // lets get rid of this
  //const [selectedUnicorn, setSelectedUnicorn] = useState(defaultUnicorn);
  const [triggerRedraw, setTriggerRedraw] = useState(0);
  const [url, setUrl] = useState(`ws://${defaultUnicorn.ip}/paint`); // lets derive this and get rid of this
  const [isIdle, setIsIdle] = useState(false);
  //const [isFetchError, setIsFetchError] = useState(false);
  //const [fetchErrorMessage, setIsFetchErrorMessage] = useState('');
  const [fetchState, setFetchState] = useState<FetchStateType>({});
  const [unicornConfigs, setUnicornConfigs] = useState(defaultUnicornConfigs);

  const onIdle = () => {
    console.log('onIdle');
    setIsIdle(true);
  }

  const onActive = () => {
    console.log('onActive');
    setIsIdle(false);
  }

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    onActive,
    timeout: 5 * 60 * 1000,
    throttle: 500
  })

  useEffect(() => {
    //const url = `ws://10.200.0.123/paint`; // Galactic
    // const url = `ws://10.200.0.122/paint`; // Cosmic 1
    // const url = `ws://10.200.0.125/paint`; // Cosmic 2
    //const url = `ws://10.200.0.126/paint`; // Cosmic 3

    if (isConnectedDesired) {
      socket = new WebSocket(url);
    }

    // const isOpen = (ws: WebSocket) => { return ws.readyState === ws.OPEN }
    
    // const clear = () => {
    //   if (socket) {
    //     socket.send('clear');
    //     socket.send('show');
    //   }
    // };

    rgb = randomRgb();

    // const update_pixels = () => {
    //   //console.log('update_pixels');
    //   if (socket) {
    //     //console.log(`setting ${x},${y} to ${rgb[0]},${rgb[1]},${rgb[2]}`);
    //     socket.send(new Uint8Array([x, y, rgb[0], rgb[1], rgb[2]]));
    //     socket.send('show');
        
    //     // If we are on the last dot, increment y
    //     if (x === MAX_X - 1) {
          
    //       rgb = randomRgb();
    //       if (y >= MAX_Y - 1) {
    //         y = 0;
    //       } else {
    //         y = y + 1;
    //       }
    //     }

    //     if (x >= MAX_X - 1) {
    //       x = 0;
    //     } else {
    //       x = x + 1;
    //     }
    //   }
    // };

    // const progress_bar = () => {
    //   // for(let i=0;i<MAX_X;i++) {
    //   //   for(let i=0;i<MAX_X;i++) {
    //   //   }
    //   // }

    //   if (socket) {
    //     //console.log(`setting ${x},${y} to ${rgb[0]},${rgb[1]},${rgb[2]}`);
    //     for (let i=0;i<MAX_Y-1;i++) {
    //       console.log(`setting ${x},${i} to ${rgb[0]},${rgb[1]},${rgb[2]}`);
    //       socket.send(new Uint8Array([x, i, rgb[0], rgb[1], rgb[2]]));
    //     }
    //     //socket.send(new Uint8Array([x, y, rgb[0], rgb[1], rgb[2]]));
    //     socket.send('show');

    //     // If we are on the last dot, increment y
    //     // if (x === MAX_X - 1) {
    //     //   rgb = randomRgb();
    //     //   if (y >= MAX_Y - 1) {
    //     //     y = 0;
    //     //   } else {
    //     //     y = y + 1;
    //     //   }
    //     // }

    //     if (x >= MAX_X - 1) {
    //       x = 0;
    //       rgb = randomRgb();
    //     } else {
    //       x = x + 1;
    //     }
    //   }

    // };

    // const send_emoji = () => {
    //   const c = document.querySelector('#canv') as HTMLCanvasElement;
    //   const ctx = c.getContext('2d');
    //   if (ctx) {
    //     ctx.font = '32px monospace';
    //     ctx.fillText('🚀', 32, 32);
    //     const imageData = ctx.getImageData(32, 4, 32, 32);
    
    //     const dataArray = imageData.data
    //     const rgbArray = []
    //     for (var i = 0; i < dataArray.length; i+=4) {
    //         rgbArray.push([dataArray[i], dataArray[i+1], dataArray[i+2]])
    //     }
    
    //     console.log('imageData', imageData);
    //     console.log('rgbArray', rgbArray);

    //     for(let i=0;i<MAX_X;i++) {
    //       for(let j=0;j<MAX_Y;j++) {
    //         const index = j * 32 + i;
    //         console.log('sending', [i, j, rgbArray[index][0], rgbArray[index][1], rgbArray[index][2]]);
    //         socket?.send(new Uint8Array([i, j, rgbArray[index][0], rgbArray[index][1], rgbArray[index][2]]));
    //       }
    //     }
    //     if (socket) {

    //       socket?.send('show');
    //     } else {
    //       console.log('no socket');
    //     }

    //   } else {
    //     console.log('no ctx');
    //   }
    // };

    // Connection opened
    let interval: NodeJS.Timer;

    if (socket) {
      // socket.addEventListener("open", (event) => {
      //   //socket.send("Hello Server!");
      //   console.log('connected!', new Date());
      // });
      
      socket.onopen = () => {
        console.log('onopen', new Date());
        console.log(`Connected to ${url}`);
        setIsConnected(true);
        //clear();

        //send_emoji();

        // interval = setInterval(() => {
        //   //update_pixels();
        //   //progress_bar();
        //   //send_emoji();
        // }, 60000);
      };

      socket.onmessage = () => {
        console.log('onmessage', new Date());
      };
      socket.onerror = () => {
        console.log('onerror', new Date());
      };
      socket.onclose = () => {
        console.log('onclose', new Date());
        socket = null;
        setIsConnected(false);
        setIsConnectedDesired(false);
      };
    }

    return () => {
      socket?.close();
      socket = null;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [
    isConnectedDesired,
    url,
  ]);



  const onClickConnect = () => {
    setIsConnectedDesired(true);
  };
  const onClickDisconnect = () => {
    setIsConnectedDesired(false);
  };

  
  // reconnection routine. this is super hacky lets get rid of it for something else
  // probably want to connect, send data, disconnect instead of staying connected to the websocket
  // all the time
  // or probably get rid of websocket altogether
  // useEffect(() => {
  //   let timer: NodeJS.Timeout | null = null;
  //   if (!isConnectedDesired && reconnect_counter < 100) {
  //     reconnect_counter = reconnect_counter + 1;
  //     console.log('reconnect_counter is ', reconnect_counter);
  //     timer = setTimeout(() => {
  //       setIsConnectedDesired(true);
  //     }, 2000);
  //   }
  //   return () => {
  //     if (timer) {
  //       clearTimeout(timer);
  //     }
  //   };
  // }, [isConnectedDesired]);

  // const [emoji2, setEmoji] = useState('🚀');

  const doEmojiToData = (emoji: string) => {
    const c = document.querySelector('#canv') as HTMLCanvasElement;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.font = '32px monospace';
      ctx.clearRect(0, 0, 128, 128);
      const scooch = 4;
      ctx.fillText(emoji, 0, 32 - scooch);
      const imageData = ctx.getImageData(0, 0, 32, 32);

      // get data url from canvas and store it in the unicornConfig (for the Preview display)
      //const dataUrl = c.toDataURL();
      //unicornConfigs[selectedIndex].dataUrl = dataUrl;
      //setTriggerRedraw(Date.now());
      //const dataArray = imageData.data

      return {
        data: imageData.data,
        dataUrl: c.toDataURL(),
      };
    }
  };

  const send_emoji_2 = (emoji: string) => {
    const c = document.querySelector('#canv') as HTMLCanvasElement;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.font = '32px monospace';
      ctx.clearRect(0, 0, 128, 128);
      const scooch = 4;
      ctx.fillText(emoji, 0, 32 - scooch);
      const imageData = ctx.getImageData(0, 0, 32, 32);

      // get data url from canvas and store it in the unicornConfig (for the Preview display)
      const dataUrl = c.toDataURL();
      unicornConfigs[selectedIndex].dataUrl = dataUrl;
      setTriggerRedraw(Date.now());
  
      const dataArray = imageData.data
      
      // const rgbArray: number[][] = []
      // for (var i = 0; i < dataArray.length; i+=4) {
      //     rgbArray.push([dataArray[i], dataArray[i+1], dataArray[i+2], dataArray[i+3]])
      // }
  
      //console.log('imageData', imageData);
      //console.log('rgbArray', rgbArray);

      const delay = 5;

      // for(let i=0;i<MAX_X;i++) {
      //   for(let j=0;j<MAX_Y;j++) {
      //     const index = j * 32 + i;
      //     setTimeout(() => {
      //       //console.log('sending', [i, j, rgbArray[index][0], rgbArray[index][1], rgbArray[index][2]]);
      //       socket?.send(new Uint8Array([i, j, rgbArray[index][0], rgbArray[index][1], rgbArray[index][2]]));
      //     }, index * delay);
      //   }
      // }
      // setTimeout(() => {
      //   console.log('sending show');
      //   socket?.send('show');
      // }, 1025 * delay);

      if (socket && socket.readyState === WebSocket.CONNECTING) {
        console.log('socket still connecting...');
      }
      
      if (socket && socket.readyState === WebSocket.OPEN) {

        // test sending full rgbarray in one payload
        // console.log('rgbarray len', JSON.stringify(rgbArray).length);
        // socket.send('rgbarray');
        // socket.send(JSON.stringify(rgbArray));

        if (isConnected) {
          //
          // test sending full imagedata
          console.log('imagedata length', new Uint8Array(dataArray).length)
          socket.send('imagedata');
          socket.send(new Uint8Array(dataArray));
        } else {
          console.log('isConnected === false');
        }

        //socket?.send('show');
      } else {
        console.log('no socket');
      }

    } else {
      console.log('no ctx');
    }
  };

  // const emojiChanged = (e: any) => {
  //   setEmoji(e.target.value);

  //   const c = document.querySelector('#canv') as HTMLCanvasElement;
  //   const ctx = c.getContext('2d');
  //   if (ctx) {
  //     ctx.font = '32px monospace';
  //     ctx.clearRect(0, 0, 128, 128);
  //     ctx.fillText(e.target.value, 32, 32);
  //   }
  // };

  const onSendEmoji = () => {
    //send_emoji_2();
  };

  const onEmojiClick = (e: EmojiClickData) => {
    //setEmoji(e.emoji);
    // const c = document.querySelector('#canv') as HTMLCanvasElement;
    // const ctx = c.getContext('2d');
    // if (ctx) {
    //   ctx.font = '32px monospace';
    //   ctx.clearRect(0, 0, 128, 128);
    //   ctx.fillText(e.emoji, 32, 32);
    // }

    // this works
    //send_emoji_2(e.emoji);

    const d = doEmojiToData(e.emoji);
    if (d) {
      onSendPost(d.data, d.dataUrl);
    }
  };

  const onChangeUnicorn = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('e', e.target.value);
    //setSelectedIp(e.target.value);
    setUrl(`ws://${e.target.value}/paint`);
  };

  const onSendPost = async (payload: any, dataUrl: any) => {

    const ip = unicornConfigs[selectedIndex].ip;
    const url = `http://${ip}/set_pixels`;

    // const rawResponse = await fetch(url, {
    //   method: 'POST',
    //   mode: 'no-cors',
    //   // headers: {
    //   //   'Accept': 'application/json',
    //   //   'Content-Type': 'application/json'
    //   // },
    //   body: payload
    // });
    // //const content = await rawResponse.json();
    // const content = await rawResponse.text();
    //console.log('content', content);

    const requestOptions: RequestInit = {
      method: 'POST',
      //mode: 'no-cors',
      //headers: { 'Content-Type': 'application/json' },
      body: payload
    };
    fetch(url, requestOptions)
      .then(response => response.text())
      .then(data => {
        //console.log('content text', data);
        //console.log(data);
    
        if (data === 'success') {
          //console.log('success area');
          unicornConfigs[selectedIndex].dataUrl = dataUrl;
          unicornConfigs[selectedIndex].dataRgbaArray = payload;
          setTriggerRedraw(Date.now());
        }
      });


    //return content;
  };

  const onClickGet = (index: number) => {
    const ip = unicornConfigs[index].ip;
    const url = `http://${ip}/get_pixels`;
    const requestOptions: RequestInit = {
      method: 'GET',
      //mode: 'no-cors',
      //headers: { 'Content-Type': 'application/json' },
      //body: payload
    };
    fetch(url, requestOptions)
      .then(response => {
        //console.log('got response', response.body.length);
        //return response.blob();
        return response.arrayBuffer();
      })
      .then(data => {
        //console.log('get pixels', data);
        //console.log(data);
        //console.log('data length', data.length);

        //const buffer = new ArrayBuffer(data);
        const arrayFromBuffer = new Uint8Array(data);
        //const arr = Array.from(data);
        //console.log('arrayFromBuffer len', arrayFromBuffer.length);
        //console.log(arrayFromBuffer);

        // Convert Uint8Array into number[]
        const numberArray = [];
        for(var i=0;i<arrayFromBuffer.length-1;i++) {
          numberArray.push(arrayFromBuffer[i]);
        }

        unicornConfigs[index].dataRgbaArray = numberArray;
        setTriggerRedraw(Date.now());
        
        //setIsFetchError(false);
        //setIsFetchErrorMessage(``);
        setFetchState(curr => {
          return {
            ...curr,
            [ip]: {
              isError: false,
              errorMessage: '',
              errorCount: 0,
            }
          };
        });

        // const byteArray = new Uint8Array(data);
        // byteArray.forEach((element, index) => {
        //   // do something with each byte in the array
        // });

        // let rgb = [];
        // for(var i=0;i<data.length-1;i++) {
        //   //console.log(data.charCodeAt(i) & 0xff);
        //   rgb.push(data.charCodeAt(i) & 0xff);
        // }
        // console.log(rgb);
      }).catch((err) => {
        console.log('get_pixels catch');
        unicornConfigs[index].dataRgbaArray = undefined;
        //setIsFetchError(true);
        //setIsFetchErrorMessage(`Error loading ${url}`);
        setFetchState(curr => {
          return {
            ...curr,
            [ip]: {
              isError: true,
              errorMessage: `Error loading ${url}`,
              errorCount: curr[url] ? curr[url].errorCount + 1 : 1,
            }
          };
        });
      });
  };

  // const rgba_to_rgb = (r, g, b, a) => {
  //   r = round(a * r);
  //   g = round(a * g);
  //   b = round(a * b);
  //   return
  // };

  useEffect(() => {
    onClickGet(0);
    onClickGet(1);
    onClickGet(2);
    onClickGet(3);

    let interv: NodeJS.Timer | undefined;
    if (isIdle === false) {
      interv = setInterval(() => {
        onClickGet(0);
        onClickGet(1);
        onClickGet(2);
        onClickGet(3);
      }, 15000);
    }
    return () => {
      if (interv) {
        clearInterval(interv);
      }
    };
  }, [isIdle]);

  const onClickSend = () => {
    const d = doEmojiToData('🥰');
    if (d) {
      onSendPost(d.data, d.dataUrl);
    }
  };

  const options = unicornConfigs.map((u, i) => {
    return <option key={i} value={u.ip}>{u.name} {u.ip}</option>;
  });

  const onClickUnicornPreview = () => {

  };

  const previewLoop = unicornConfigs.map((u, i) => {
    const ip = unicornConfigs[i].ip;

    return (
      <Preview
        key={i}
        keyId={i}
        selected={i === selectedIndex}
        config={u}
        dataRgbaArray={unicornConfigs[i].dataRgbaArray}
        isError={fetchState[ip] && fetchState[ip].isError}
        onClick={() => {
          setSelectedIndex(i);
          //setSelectedIp(unicornConfigs[i].ip);
          setUrl(`ws://${unicornConfigs[i].ip}/paint`);
        }}
      />
    );
  });

  const errorLoop = Object.keys(fetchState).map((ip, i) => {
    if (fetchState[ip].isError) {
      return <div key={i} className="fetch-error-message">{fetchState[ip].errorMessage} x{fetchState[ip].errorCount}</div>;
    }
  });

  return (
    <div className="App">
      {/* Unicorn Paint React{' '} */}
      <br />

      {/* <select onChange={onChangeUnicorn} value={selectedIp}>
        {options}
      </select>
      <br />
      {!isConnectedDesired && <button style={{ backgroundColor: 'green', color: 'white' }} disabled={isConnectedDesired} onClick={onClickConnect}>Connect</button>}
      {isConnectedDesired && <button style={{ backgroundColor: 'darkred', color: 'white' }} disabled={!isConnectedDesired} onClick={onClickDisconnect}>Disconnect</button>}
      <div>
        Status: {isConnected ? <span style={{ color: 'lime'}}>Connected</span> : <span style={{ color: 'darkred'}}>Disconnected</span>}
      </div> */}
      
      {/* <button onClick={onClickSend}>POST</button> */}

      {/* <button onClick={onClickGet}>GET</button> */}

      <div style={{ marginTop: 8 }}>
        {/* <Preview name="Cosmic 1" />
        <Preview name="Cosmic 2" />
        <Preview name="Cosmic 3" />
        <Preview name="Cosmic 4" /> */}
        {previewLoop}
      </div>

      {/* Show Errors */}
      {/* {errorLoop} */}

      <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
        {/* <input
          type="text"
          //onChange={emojiChanged}
          value={emoji}
        /> */}
        {/* <button onClick={onSendEmoji}>send</button> */}

        <EmojiPicker
          theme={Theme.DARK}
          onEmojiClick={onEmojiClick}
          width="100%"
          height="75vh"
        />

      </div>

      <div className="canvas-area">
        Canvas: <canvas id="canv" width="32" height="32" style={{ border: '1px solid orange' }}></canvas>
      </div>

      {/* <Settings
        unicornConfigs={unicornConfigs}
        setUnicornConfigs={setUnicornConfigs}
      /> */}

    </div>
  );
}

export default App;
