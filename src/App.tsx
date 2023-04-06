import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import Preview from './widgets/Preview';
import { UnicornType } from './types/paint';

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

const unicornConfigs: UnicornType[] = [
  {
    name: 'Galactic',
    ip: '10.200.0.123',
    type: 'galactic',
    dataUrl: undefined,
  },
  {
    name: 'Cosmic 1',
    ip: '10.200.0.122',
    type: 'cosmic',
    dataUrl: undefined,
  },
  {
    name: 'Cosmic 2',
    ip: '10.200.0.125',
    type: 'cosmic',
    dataUrl: undefined,
  },
  {
    name: 'Cosmic 3',
    ip: '10.200.0.126',
    type: 'cosmic',
    dataUrl: undefined,
  },
];

const defaultIndex = 3;
const defaultUnicorn = unicornConfigs[defaultIndex];

function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [selectedUnicorn, setSelectedUnicorn] = useState(defaultUnicorn);
  const [url, setUrl] = useState(`ws://${defaultUnicorn.ip}/paint`);

  useEffect(() => {
    //const url = `ws://10.200.0.123/paint`; // Galactic
    // const url = `ws://10.200.0.122/paint`; // Cosmic 1
    // const url = `ws://10.200.0.125/paint`; // Cosmic 2
    //const url = `ws://10.200.0.126/paint`; // Cosmic 3

    if (isConnected) {
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
      };
    }

    return () => {
      socket?.close();
      socket = null;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isConnected, url]);

  const onClickConnect = () => {
    setIsConnected(true);
  };
  const onClickDisconnect = () => {
    setIsConnected(false);
  };

  

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (!isConnected && reconnect_counter < 100) {
      reconnect_counter = reconnect_counter + 1;
      console.log('reconnect_counter is ', reconnect_counter);
      timer = setTimeout(() => {
        setIsConnected(true);
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isConnected]);

  // const [emoji2, setEmoji] = useState('🚀');

  const send_emoji_2 = (emoji: string) => {
    const c = document.querySelector('#canv') as HTMLCanvasElement;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.font = '32px monospace';
      ctx.clearRect(0, 0, 128, 128);
      const scooch = 4;
      ctx.fillText(emoji, 0, 32 - scooch);
      const imageData = ctx.getImageData(0, 4, 32, 32);

      // get data url
      const dataUrl = c.toDataURL();
      unicornConfigs[selectedIndex].dataUrl = dataUrl;
  
      const dataArray = imageData.data
      const rgbArray: number[][] = []
      for (var i = 0; i < dataArray.length; i+=4) {
          rgbArray.push([dataArray[i], dataArray[i+1], dataArray[i+2], dataArray[i+3]])
      }
  
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
      
      if (socket) {

        // test sending full rgbarray in one payload
        // console.log('rgbarray len', JSON.stringify(rgbArray).length);
        // socket.send('rgbarray');
        // socket.send(JSON.stringify(rgbArray));

        // test sending full imagedata
        console.log('imagedata length', new Uint8Array(dataArray).length)
        socket.send('imagedata');
        socket.send(new Uint8Array(dataArray));

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
    send_emoji_2(e.emoji);
  };

  const onChangeUnicorn = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('e', e.target.value);
    setUrl(`ws://${e.target.value}/paint`)
  };

  const options = unicornConfigs.map((u, i) => {
    return <option selected={u.ip === defaultUnicorn.ip} value={u.ip}>{u.name} {u.ip}</option>;
  });

  const onClickUnicornPreview = () => {

  };

  const previewLoop = unicornConfigs.map((u, i) => {
    return <Preview config={u} onClick={() => setSelectedIndex(i)} />;
  });

  return (
    <div className="App">
      Unicorn Paint React{' '}<br />
      <select onChange={onChangeUnicorn}>
        {/* <option value="10.200.0.123">Galactic 10.200.0.123</option>
        <option value="10.200.0.122" selected>Cosmic 1 10.200.0.122</option>
        <option value="10.200.0.125">Cosmic 2 10.200.0.125</option>
        <option value="10.200.0.126">Cosmic 3 10.200.0.126</option> */}
        {options}
      </select>
      <br />
      {!isConnected && <button style={{ backgroundColor: 'green', color: 'white' }} disabled={isConnected} onClick={onClickConnect}>Connect</button>}
      {isConnected && <button style={{ backgroundColor: 'darkred', color: 'white' }} disabled={!isConnected} onClick={onClickDisconnect}>Disconnect</button>}
      <div>
        Status: {isConnected ? <span style={{ color: 'lime'}}>Connected</span> : <span style={{ color: 'darkred'}}>Disconnected</span>}
      </div>

      <div>
        {/* <Preview name="Cosmic 1" />
        <Preview name="Cosmic 2" />
        <Preview name="Cosmic 3" />
        <Preview name="Cosmic 4" /> */}
        {previewLoop}
      </div>

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
          height="80vh"
        />

      </div>
      <div>
        Canvas: <canvas id="canv" width="32" height="32" style={{ border: '1px solid orange' }}></canvas>
      </div>
    </div>
  );
}

export default App;
