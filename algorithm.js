//Euristica costruttiva per GAP

//Per tutti i for J indice dei clienti mente I indice dei magazzini

function solveCostruttiva(){
	//alert("Euristica Costruttiva");

	var capLeft = cap.slice(); //copia l'array delle caacità perchè all'inizio i magazzini hanno ancora tutti i prodotti
	var z = 0;

	sol = new Array(n);
	var dist = new Array(m);
	for (i=0;i<m;i++)
		dist[i] = new Array(2);

	//per ogni cliente scelgo il magazzino ammissibile a costo minore
	for (j=0;j<n;j++){

		for (i=0;i<m;i++){
			dist[i][0] = req[i][j];
			dist[i][1] = i;
		}
		dist.sort(compareKey);

		var ii = 0;
		while(ii<m){

			i = dist[ii][1];
			if(capLeft[i] >= req[i][j])
			{
				sol[j] = i;
				capLeft[i] -= req[i][j];
				z += c[i][j];
				break;
			}
			ii ++;	
		}
	}

	var zVerify = verifySol(sol);

	if(z < zub)
	{
		console.log("Costruttiva new zub: " + zub);
		zub = z;
		solbest = sol.slice();
	}

	//alert("Costo -> " + z + " | Verifica: " + zVerify + " | Soluzione -> " + sol);
}

function compareKey(a,b){

	if(a[0] === b[0])
		return 0
	else
		return ( a[0] < b[0] ? -1 : 1 );
}

// controllo ammissibilità della soluzione
function verifySol(sol){
   var z = 0, j;
   var capused = new Array(m);
   for(i=0;i<m;i++){
   	capused[i] = 0;
   }

   // controllo assegnamenti
   for (j = 0; j < n; j++)
      if (sol[j] < 0 || sol[j] >= m || sol[j]===undefined) 
      {  z = Number.MAX_VALUE;
         return z;
      } 
      else
         z += c[sol[j]][j];

   // controllo capacità
   for (j = 0; j < n; j++) 
   {  capused[sol[j]] += req[sol[j]][j];
      if (capused[sol[j]] > cap[sol[j]]) 
      {  z = Number.MAX_VALUE;
         return z;
      }
   }
   return z;
}

function optimizeSolution10(cost){
	//alert("Optimize Solution by opt10");
	var i, isol, j, z = 0;
	var isImproved;
	var capLeft = cap.slice();

	//Per ogni cliente vado a staccare l'arco dal magazzino che è in soluzione e vado a cercare se tra tutti gli altri magazzini c'è uno che conviene mettere in soluzione
	//dopo di che valuto anche se è ammissibile ammetterlo in soluzione
	for(j=0; j<n; j++){
		capLeft[sol[j]] -= req[sol[j]][j];
		z += cost[sol[j]][j]; 
	}

	do{
		isImproved = false;
		for(j=0; j<n; j++){
			isol = sol[j]
			for(i=0; i<m; i++){
				if(i==isol)	continue;

				if(cost[i][j]<cost[isol][j] && capLeft[i] >= req[i][j]){
					sol[j]=i;
					capLeft[i] -= req[i][j];
					capLeft[isol] += req[isol][j];
					z -= cost[isol][j] - cost[i][j];
					console.log("Opt 10, improvement: z = " + z + ", j: " + j + ", da: " + isol + " a " + i );
					isImproved = true;
					break;
				}
			}
			if (isImproved) break;
		}	
	}
	while(isImproved);
	

	var zVerify = verifySol(sol);

	if(z < zub)
	{
		zub = z;
		solbest = sol.slice();
		console.log("Opt 10 new zub: " + zub);
	}

	//alert("Costo -> " + z + " | Verifica: " + zVerify + " | Soluzione -> " + sol);

	return z;
}

function optimizeSolutionSimAnnealing(){
	alert("Optimize Solution by Sim. Annealing");
	var i, isol, j, z = 0;
	var T, iter, p, rnd, k=1, alpha;
	var capLeft = cap.slice();

	if(zub > 0.99*Number.MAX_VALUE){
		alert("Manca la costruttiva");
		return;
	}

	//Per ogni cliente vado a staccare l'arco dal magazzino che è in soluzione e vado a cercare se tra tutti gli altri magazzini c'è uno che conviene mettere in soluzione
	//dopo di che valuto anche se è ammissibile ammetterlo in soluzione
	for(j=0; j<n; j++){
		capLeft[sol[j]] -= req[sol[j]][j];
		z += c[sol[j]][j]; 
	}


	iter = 0;
	T = 1000;
	alpha = 0.95

	do{
		iter ++;
		if((iter%100) == 0){
			console.log("ITER: " + iter);
		}
		console.log("Iter: " + iter );
		isImproved = false;
		j = Math.floor(Math.random()*n );
		isol = sol[j]

		i = Math.floor(Math.random()*m );

		if(i==isol)	i = (i+1)%m;

		if(c[i][j]<c[isol][j] && capLeft[i] >= req[i][j]){
			sol[j]=i;
			capLeft[i] -= req[i][j];
			capLeft[isol] += req[isol][j];
			z -= c[isol][j] - c[i][j];
			console.log("Opt Sim. Annealing, improvement: z = " + z + ", j: " + j + ", da: " + isol + " a " + i );

			if(z < zub)
			{
				console.log("Opt SA new zub: " + zub);
				zub = z;
				solbest = sol.slice();
			}
		}
		else{
			if(capLeft[i] >= req[i][j]){
				p = Math.exp(-(c[i][j]-c[isol][j])/(k*T));
				rnd = Math.random();
				if(rnd < p){
					sol[j]=i;
					capLeft[i] -= req[i][j];
					capLeft[isol] += req[isol][j];
					z -= c[isol][j] - c[i][j];
					console.log("Sim. Annealing, scambio peggiorativo: z = " + z + ", j: " + j + ", da: " + isol + " a " + i );
				}
			}
		}

		if((iter%1000) == 0){
			T = alpha * T;
		}
		if(T <= 0.001){
			T = maxT;
		}
	}
	while(iter < 50000);
	
	var zVerify = verifySol(sol);

	if(z < zub)
	{
		console.log("Opt 10 new zub: " + zub);
		zub = z;
		solbest = sol.slice();
	}

	alert("Costo -> " + z + " | Verifica: " + zVerify + " | Soluzione -> " + sol);
}

function optimizeSolutiontabuSearch(){
	//alert("Tabù Search");
	var i, isol, j, z = 0;
	var deltaMax, tTenure, maxIter;
	var capLeft = cap.slice();
	var maxI = 0;
	var maxJ = 0;

	//----------------PARAMETRI----------------
	tTenure = 2*n*m;
	maxIter = 1000;
	//----------------PARAMETRI----------------


	var TL = new Array(m);
	for(j=0; j<n; j++){
		TL[j] = new Array(n);
		for(i=0; i<m; i++){
			TL[j][i] = 0;
		}
	}

	//Per ogni cliente vado a staccare l'arco dal magazzino che è in soluzione e vado a cercare se tra tutti gli altri magazzini c'è uno che conviene mettere in soluzione
	//dopo di che valuto anche se è ammissibile ammetterlo in soluzione
	for(j=0; j<n; j++){
		capLeft[sol[j]] -= req[sol[j]][j];
		z += c[sol[j]][j];
		for(i=0; i<m; i++){
			TL[i][j] = Number.MIN_VALUE; 
		} 
	}

	iter = 0;
	do{
		iter ++;
		delta = 0;
		deltaMax = 0;

		for(j=0; j<n; j++){
			isol = sol[j]
			for(i=0; i<m; i++){
				
				if(i==isol)	continue;

				if(TL[i][j] <= iter){
					
					if(c[i][j]<c[isol][j] && capLeft[i] >= req[i][j]){

						delta =  c[isol][j] - c[i][j];
						//if(delta > deltaMax && TL[i][j] <= iter){
						if(delta > deltaMax){
							maxI = i;
							maxJ = j;
							deltaMax = delta;
						}
					}	
				}
			}
		}

		//Miglioramento Massimo dell'intorno non TABU'
		TL[maxI][maxJ] = iter + tTenure;

		isol = sol[maxJ];
		//deltaMax = c[isol][maxJ] - c[maxI][maxJ];
		sol[maxJ] = maxI;

		capLeft[maxI] -= req[maxI][maxJ];
		capLeft[isol] += req[isol][maxJ];
		z -= deltaMax;

		var zVer = verifySol(sol);

		if(z < zub && z === zVer)
		{
			console.log("Tabù Search new zub: " + zub);
			zub = z;
			solbest = sol.slice();
		}
		
		console.log("Tabù Search - z = " + z + ", j: " + j + ", da: " + isol + " a " + i );

	}
	while(iter < maxIter);
	

	//var zVerify = verifySol(solbest);

	/*if(z < zub)
	{
		zub = z;
		solbest = sol.slice();
		console.log("Tabù Search new zub: " + zub);
	}*/

	return z;

	//alert("Costo -> " + zub + " | Verifica: " + zVerify + " | Soluzione -> " + solbest);
}

function optimizeIteratedLocalSearch(){

	alert("Iterated Local Search");

	var t0, tcurr, tspan;
	var maxIter, maxT;
	var i, k, j, iter;

	if(zub > 0.99*Number.MAX_VALUE){
		alert("Manca la costruttiva");
		return;
	}

	t0 = new Date();
	tspan = 0;
	iter = 0;

	maxIter = 1000;
	maxT = 10000;

	while (iter < maxIter && tspan < maxT){

		z = optimizeSolution10(c);
		if(z < zub){
			console.log("New zub " + z);
			zub = z;
		}
		dataPerturbation();

		iter ++;
		tcurr = new Date();
		tspan = tcurr - t0;
	}

	/*if(z < zub)
	{
		console.log("Tabù Search new zub: " + zub);
		zub = z;
		solbest = sol.slice();
	}*/

	alert("Sono passati " + tspan + " ms - zub: " + zub);
	
}

function dataPerturbation(){
	var i, j;
	var cprimo = new Array(m);

	for(i=0; i<m; i++){
		cprimo[i] = new Array(n);
	}

	for(i=0; i<m; i++){
		for(j=0; j<n; j++){
			//Genera un costo che differisce da quello iniziale del 0.25
			cprimo[i][j] = (c[i][j] * 0.75) + Math.random()*0.5*c[i][j];
		}
	}

	//Viene modificata la soluzione deltro l'optimizeSolution10 per cui quando torno all'interno del ciclo while lavoro sui nuovi dati.
	optimizeSolution10(cprimo);
}

function optimizeGrasp(maxIter, maxT, k){
	var iter = 0;
	var z = 0;
	var t0, tcurr, tspan;

	t0 = new Date();
	tspan = 0;
	iter = 0;

	while(iter < maxIter && tspan < maxT){

		z = solveGraspCostruttiva(k);
		/*if(z<zub){
			zub = z;
		}*/

		//z=optimizeSolution11(c);
		z = optimizeSolution10(c);
		/*if(z<zub){
			zub = z;
		}*/
		z = optimizeSolution11(c);
		/*if(z<zub){
			zub = z;
		}*/
		console.log("GRASP -- iter: " + iter +" z: " + z + " zub: " + zub);
		iter ++;
		tcurr = new Date();
		tspan = tcurr - t0;
	}

	var zVer = verifySol(solbest);

	alert("GRASP --  zub: " + zub + " iter: " + iter + " time: " + tspan + " zVer: " + zVer);

}

function solveGraspCostruttiva(k){
	//alert("Euristica Costruttiva");

	var capLeft = cap.slice(); //copia l'array delle caacità perchè all'inizio i magazzini hanno ancora tutti i prodotti
	var z = 0;
	var ii, icand = 0;

	sol = new Array(n);
	var dist = new Array(m);
	for (i=0;i<m;i++)
		dist[i] = new Array(2);

	//per ogni cliente scelgo il magazzino ammissibile a costo minore
	for (j=0;j<n;j++){

		for (i=0;i<m;i++){
			dist[i][0] = req[i][j];
			dist[i][1] = i;
		}
		dist.sort(compareKey);

		icand = Math.floor(Math.random()*k+0.5);

		ii = 0;
		while(ii<m){

			i = dist[(ii+icand)%m][1];
			if(capLeft[i] >= req[i][j])
			{
				sol[j] = i;
				capLeft[i] -= req[i][j];
				z += c[i][j];
				break;
			}
			ii ++;	
		}
	}

	var zVerify = verifySol(sol);

	if(z < zub)
	{
		zub = z;
		solbest = sol.slice();
		console.log("Costruttiva new zub: " + zub);
	}

	return z;
}

function optimizeSolution11(cost){
	//alert("Optimize Solution by opt10");
	var i, isol, j, jsec, z = 0;
	var isImproved;
	var capLeft = cap.slice();
	var delta = 0;
	var cap1 = 0, cap2 = 0;

	//Per ogni cliente vado a staccare l'arco dal magazzino che è in soluzione e vado a cercare se tra tutti gli altri magazzini c'è uno che conviene mettere in soluzione
	//dopo di che valuto anche se è ammissibile ammetterlo in soluzione
	for(j=0; j<n; j++){
		capLeft[sol[j]] -= req[sol[j]][j];
		z += cost[sol[j]][j]; 
	}

	var iter = 0;
	do{
		isImproved = false;
		for(j=0; j<n; j++){
			
			for(jsec=0; jsec<n; jsec++){

				if(j === jsec) continue;

				delta = (cost[sol[j]][j] + cost[sol[jsec]][jsec]) - (cost[sol[j]][jsec] + cost[sol[jsec]][j])

				//Se delta è maggiore di zero lo scambio conviene per cui controllo le capacità
				if(delta > 0){

					cap1 = capLeft[sol[j]] + req[sol[j]][j] - req[sol[jsec]][jsec];
					cap2 = capLeft[sol[jsec]] + req[sol[jsec]][jsec] - req[sol[j]][j];

					//Se i magazzini riescono a soffisfare le richieste perchè le capacità sono pari o maggiori di zero, allora faccio lo scambio
					if(cap1 >= 0 && cap2 >= 0){

						var app = sol[j];
						sol[j] = sol[jsec];
						sol[jsec] = app;

						capLeft[sol[j]] = capLeft[sol[j]] - req[sol[j]][j] + req[sol[j]][jsec];
						capLeft[sol[jsec]] = capLeft[sol[jsec]] - req[sol[jsec]][jsec] + req[sol[jsec]][j];
						
						z = z - delta;

						console.log("Opt 11 [iter: " + iter + "], improvement: z = " + z );
						isImproved = true;
						break;
					}
				}
			}
			if (isImproved) break;
		}
		iter ++;	
	}
	while(isImproved);
	

	var zVerify = verifySol(sol);

	if(z < zub)
	{
		zub = z;
		solbest = sol.slice();
		console.log("Opt 11 new zub: " + zub);
	}

	return z;
}

//Funzione Lorenzo
/*function optimizeSolution11(costi)
{
    var i, isol, j=0, j1=0, sj, sj1;
    var z = 0;
    var isImproved;
    var capLeft = cap.slice();
    var delta = 0;
    var a=0,b=0;

    for(j = 0; j < n; j++)
    {
        capLeft[sol[j]] -= req[sol[j]][j];
        z += costi[sol[j]][j];
    }
    do
    {
        isImproved = false;
        for (j = 0; j < n-1; j++) 
        {
            for(j1 = (j+1) ; j1 < n; j1++)
            {
                sj = sol[j];
                sj1 = sol[j1];
                delta = 0;
                delta = (costi[sj][j] + costi[sj1][j1]) - (costi[sj][j1] + costi[sj1][j]);

                if(delta > 0)
                {
                    a = capLeft[sj] + req[sj][j];
                    b = capLeft[sj1] + req[sj1][j1];
                    if(a >= req[sj1][j1] && b >= req[sj][j])
                    {
                        sol[j] = sj1;
                        sol[j1] = sj;
                        sj = sol[j];
                        sj1 = sol[j1];
                        capLeft[sj] -= req[sj][j];
                        capLeft[sj] += req[sj][j1];
                        capLeft[sj1] -= req[sj1][j1];
                        capLeft[sj1] += req[sj1][j];
                        z = z - delta;
                        isImproved = true;
                        break;
                    }
                }
            }
            if(isImproved)
                break;     
        }     
    } while(isImproved);

    var checkVal = Math.abs(verifySol(sol) - z);
    if(checkVal <= EPS ){
    	alert("New zub = " + z);
        return z;  
    }
    else
        alert("Errore!!");
}*/

function optimizeVns(maxIter, maxT, k){

	var iter = 0;
	var z, z10, z11, ztabu = 0;
	var t0, tcurr, tspan;
	var isFinished = false;

	t0 = new Date();
	tspan = 0;
	iter = 0;

	solveCostruttiva();

	while(iter < maxIter && tspan < maxT && !isFinished){

		z10 = optimizeSolution10(c);

		z11 = optimizeSolution11(c);

		if(z11 === z10){

			ztabu = optimizeSolutiontabuSearch();

			if(ztabu === z11){
				isFinished = true;
			}
			isFinished = true;

		}

		/*if(!isFinished){
			dataPerturbation(c);
		}*/

		console.log("VNS -- iter: " + iter +" z: " + z + " zub: " + zub);
		iter ++;
		tcurr = new Date();
		tspan = tcurr - t0;
	}

	var zVer = verifySol(solbest);

	alert("VNS --  zub: " + zub + " [zVer: " + zVer +"] iter: " + iter + " time: " + tspan);

	
}