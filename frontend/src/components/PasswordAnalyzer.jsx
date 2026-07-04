import { useState } from "react";
import axios from "axios";

function PasswordAnalyzer() {

const [password,setPassword]=useState("");
const [result,setResult]=useState(null);


const analyzePassword = async()=>{

try{

const response = await axios.post(

"${API}/analyze",

{
password
}

);

setResult(response.data);

}

catch(error){

console.log(error);

}

};



const generatePassword = async()=>{

try{

const response = await axios.get(

"${API}/generate"

);

setPassword(response.data.password);

}

catch(error){

console.log(error);

}

};



return(

<div className="bg-slate-900 rounded-2xl p-8 h-full min-h-[700px] flex flex-col">


<h2 className="text-3xl font-bold text-white mb-6">

🔑 Password Analyzer

</h2>



<input

value={password}

onChange={(e)=>setPassword(e.target.value)}

placeholder="Enter Password"

className="w-full p-4 rounded-lg bg-slate-800 text-white"

/>



<div className="flex gap-4 mt-5">


<button

onClick={analyzePassword}

className="bg-cyan-500 px-5 py-3 rounded-lg"

>

Analyze


</button>



<button

onClick={generatePassword}

className="bg-green-500 px-5 py-3 rounded-lg"

>

Generate


</button>


</div>

{

result && (

<div className="mt-8 p-5 rounded-xl bg-slate-800 border border-slate-700">

<h3 className="text-xl font-semibold text-cyan-400 mb-4">

Analysis Result

</h3>


<p className="text-white">

Score : {result.score}

</p>

<p
className={`font-semibold ${
result.rating==="Strong"
? "text-green-400"
: result.rating==="Medium"
? "text-yellow-400"
: "text-red-400"
}`}
>

Rating : {result.rating}

</p>



<p className="text-white">

Entropy :

{" "}

{result.entropy}

</p>



<p className="text-white">

Crack Time :

{" "}

{result.crack_time}

</p>

<div className="mt-4">

<div className="w-full bg-slate-700 rounded-full h-3">

<div

className={`h-3 rounded-full ${
result.score>=4
? "bg-green-500"
: result.score>=2
? "bg-yellow-500"
: "bg-red-500"
}`}

style={{

width:`${result.score*20}%`

}}

>

</div>

</div>

</div>

{

result.score===5 && (

<div className="mt-5 p-4 rounded-xl bg-green-900/30 border border-green-500">

<p className="text-green-400 font-semibold">

✅ Excellent Password

</p>

<p className="text-green-300 text-sm">

No improvements needed

</p>

</div>

)

}

{

result.suggestions?.length > 0 && (

<div

className="mt-6 p-4 bg-slate-800 rounded-xl"

>

<h3 className="text-yellow-400 font-semibold mb-3">

Suggestions

</h3>

<ul>

{

result.suggestions.map(

(item,index)=>(

<li

key={index}

className="text-yellow-300 mb-2"

>

⚠️ {item}

</li>

)

)

}

</ul>

</div>

)

}


</div>

)

}



</div>

);


}


export default PasswordAnalyzer;