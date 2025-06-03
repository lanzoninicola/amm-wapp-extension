import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function AppAssistenteEscolha() {

  const data: Todo | null = useData('https://jsonplaceholder.typicode.com/todos/1');

  return (
    <Draggable>
      <div className="w-[100px] h-[100px] bg-red-500 z-[999999] fixed cursor-move">
        {/* conteúdo opcional aqui */}

        <div className="text-white p-2">
          {data ? (
            <div>
              <h3 className="text-lg font-bold">Assistente Escolha</h3>
              <p>{data?.title || "titolo"}</p>
            </div>
          ) : (
            <p>Carregando...</p>
          )}
        </div>
      </div>
    </Draggable>
  );
}


function useData(url: string): Todo | null {
  const [data, setData] = useState(null);


  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(json => {
        setData(json);
      })

  }, [url]);


  return data;
}