//Funzione Mia
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