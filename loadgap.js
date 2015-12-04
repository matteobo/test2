//document.write('<scr'+'ipt type="text/javascript" src="algoritm.js" ></scr'+'ipt>');

var data;

function readWithCORS(fileName)
{  
   var req = new XMLHttpRequest();
   if ('withCredentials' in req) 
   {  req.open('GET', 'http://astarte.csr.unibo.it/gapdata/' + fileName, true);
      req.onreadystatechange = function() 
      {
        if (req.readyState === 4) 
            if (req.status >= 200 && req.status < 400) 
            {  
               //data = req.responseText;//JSON.parse(req.responseText);
               //alert("DATA="+data);

               jIstance = JSON.parse(req.responseText);
               readInstance(jIstance);
            }
            else 
            {  // Handle error case
               alert(req.status);
            }
       };
      req.send();
   }
}

function readInstance(jIstance){
   alert("Solving instance : " + jIstance.nome);

   n = jIstance.clienti;
   m = jIstance.magazzini;
   c = jIstance.costi;

   req = jIstance.req;
   cap = jIstance.cap;
}
