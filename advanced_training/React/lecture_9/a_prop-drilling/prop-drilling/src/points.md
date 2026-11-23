

Context : 

     Step 1)  Create a Context:
             const someContext = createContext(defaultValue); 

    Step 2)  Provider component - custom component return Context
             export function someComponent(){
                // initialize state 
                    const [{name,age,job},dispatch] = useReducer(reducer,{
                        name:'bob',
                        age:29,
                        job:'software engineer'
                    })

                    //return my context as a provider             
                    return <someContext.provider values={name,age,dispatch}> 
                        {children}               
                      </SomeContext>

             }

        step 3) 

                  export function App(){

                    return (
                          <someComponent> 
                                <Header/>
                                <Main/>         
                         </someComponent>

                    )
                     
                  }

        step4)  

              import {useContext} fro 'react'; 
        
              export function Main(){

                     const {name,age}   = useContext() ; // {name,age}


            return <> 
              <div>  {name}  </div>
             <div>  {age}  </div>    

             function callback1(){

                dispatch({type:'action1'})

             } 
             
             <button onClick={callback1}>
               
              </button>
          
        }