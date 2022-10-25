import { useState, useEffect } from 'react';
import './App.css';


function fetchData(url, options, callback) {
  options.mode = 'cors';
  fetch("http://127.0.0.1:8000"+url, options)
  .then(response => response.json())
  .then((data) => {
    callback(data['data']);
  })
  .catch((err) => {
    console.log(err.message);
  })
}

function postOption(data) {
  return {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }
}

function Post(props) {

  const [content, setContent] = useState("Loading...");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchData('/get', postOption({idx: props.idx}), (data) => {
      setContent(data.content);
      setLikes(data.likes)
    })
  }, [props.idx])

  function handleEdit () {
    fetchData('/edit', postOption({
      idx: props.idx,
      updated: content,
    }), (data) => {
      setContent(data.content);
      setLikes(data.likes);
      setEditing(false);
    })
  }

  function handleLike() {
    fetchData('/like', postOption({
      idx: props.idx,
      like: !liked
    }), (data) => { 
      setLikes(data);
      setLiked(!liked);
    })
  }

  if (!editing) {
    return (
      <div className='Post'>
        <p>{content}</p>
        <div>
          <button onClick={() => handleLike()}>Likes: {likes}</button>
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      </div>
    )
  } else {
    return (
      <div className='Post'>
        <textarea value={content} onChange={(e)=>{setContent(e.target.value)}}/>
        <div>
          <button onClick={() => handleEdit()}>Submit</button>
          <button onClick={() => props.handleDeletion(props.idx)}>Delete</button>
        </div>
      </div>
    )
  }
}

function TimeLine(props) {
  return (
    <div>
      { props.indexes.map((idx) => {
          return (
            <Post 
              idx={idx} 
              key={idx} 
              handleDeletion={props.handleDeletion}
            ></Post>)
      }) }
    </div>
  )
}

function App() {

  const [indexes, setIndexes] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    fetchData('/get_all', {}, setIndexes)
  }, [])

  function handleNewPost () {
    fetchData('/new', postOption({content: newPostContent}), (idx) => {
      setIndexes([...indexes, idx]);
      setNewPostContent("");
    })
  }

  function handleDeletion (idx) {
    fetchData('/delete', postOption({idx: idx}), (deleted) => {
      setIndexes(indexes.filter((idx) => idx !== deleted));
    })
  }
  
  return (
    <div className='App'>
      <div className='Input'>
        <textarea 
          value={newPostContent} 
          onChange={(e) => setNewPostContent(e.target.value)}></textarea>
        <button
          onClick={() => handleNewPost()}
        >Post</button>
      </div>
      <TimeLine indexes={indexes} handleDeletion={handleDeletion} />
    </div>
  );
}

export default App;
