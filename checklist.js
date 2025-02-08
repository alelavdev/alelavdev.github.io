function goToPage(page) {
    window.location.href = page;
  }
  
document.addEventListener('DOMContentLoaded', function() {
    
    const sezioni = document.querySelectorAll('.sezione');
    const homeLink = document.getElementById('home-page');
    const previsioniLink = document.getElementById('previsioni-orarie');
    const produzioneLink = document.getElementById('aree-produzione');
    const taskPageLink = document.getElementById('task-page');
    const areaButtons = document.querySelectorAll('.area-btn');
    const componentiAree = document.querySelectorAll('.componenti-area'); 
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
    const categoriaContainer = document.getElementById('categoria-container');
    const categoriaSelect = document.getElementById('categoria-select');
    const confermaCategoriaButton = document.getElementById('conferma-categoria');
    const taskLists = document.querySelectorAll('.task-list'); 
    const searchTaskInput = document.getElementById('search-task');
    const deleteAllButton = document.getElementById('delete-all-tasks'); 
    const taskModal = document.getElementById('task-modal');
    const modificaTaskButton = document.getElementById('modifica-task');
    const completaTaskButton = document.getElementById('completa-task');
    const eliminaTaskButton = document.getElementById('elimina-task');
    const chiudiModalButton = document.getElementById('chiudi-modal');
    let taskDaAggiungere = '';
    const scattaFotoButton = document.getElementById('scatta-foto');
    let currentTask = null;
    const taskImageInput = document.createElement('input');
    taskImageInput.type = 'file';
    taskImageInput.accept = 'image/*';
    taskImageInput.capture = 'camera';
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const chiudiImmagine = document.getElementById('chiudi-immagine');
    const managerNameInput = document.getElementById('manager-name');
    const dataTurnoInput = document.getElementById('data-turno');
    const shiftPartInput = document.getElementById('shift-part');
    const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');
    const commentiHome = document.getElementById('commenti-analisi'); 
    const previsioniOrarieInputs = document.querySelectorAll('.previsioni-input'); 
    const obiettiviTurnoInputs = document.querySelectorAll('.obiettivi-input'); 
    const postTurnoCommenti = document.querySelectorAll('.post-turno-commenti'); 
    const exportButton = document.getElementById('export-button');
    const importButton = document.getElementById('import-button');
    const importInput = document.getElementById('import-input');
    const exportModal = document.getElementById('export-modal');
    const downloadFileButton = document.getElementById('download-file');
    const shareFileButton = document.getElementById('share-file');
    const chiudiModalExportButton = document.getElementById('chiudi-modal-export');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const inputFields = document.querySelectorAll('input[type="text"], input[type="date"], input[type="number"], textarea');
    const checkboxFields = document.querySelectorAll('input[type="checkbox"]');
    const clearAllButton = document.getElementById('clear-all-button');
    const documentazioneLink = document.getElementById('documentazione-page');

    documentazioneLink.addEventListener('click', function() {
        mostraSezione('documentazione-sezione');
    });
  
    function cancellaTutto() {
        
        inputFields.forEach(field => {
            field.value = '';
        });
    
        checkboxFields.forEach(checkbox => {
            checkbox.checked = false;
        });
      
        const righeAggiunte = document.querySelectorAll('.riga-aggiunta');
        righeAggiunte.forEach(riga => {
            riga.remove(); 
        });
    
        localStorage.clear();  
        salvaDatiLocali();  
    }
    
    clearAllButton.addEventListener('click', function() {
        document.getElementById('customConfirm').style.display = 'block';
    });

    document.getElementById('confirmYes').addEventListener('click', function() {
        cancellaTutto();
        document.getElementById('customConfirm').style.display = 'none';
    });

    document.getElementById('confirmNo').addEventListener('click', function() {
        document.getElementById('customConfirm').style.display = 'none';
    });
  
    function apriModaleEsporta() {
        exportModal.style.display = 'block'; 
    }
  
    chiudiModalExportButton.addEventListener('click', function() {
        exportModal.style.display = 'none';   
    });
  
    function raccogliDati() {
        const datiDaSalvare = {
            commentiHome: commentiHome.value,
            previsioniOrarie: Array.from(previsioniOrarieInputs).map(input => input.value),
            obiettiviTurno: Array.from(obiettiviTurnoInputs).map(input => input.value),
            taskData: {},
            postTurnoCommenti: Array.from(postTurnoCommenti).map(commento => commento.value),
            managerName: document.getElementById('manager-name').value,
            dataTurno: document.getElementById('data-turno').value,
            shiftPart: document.getElementById('shift-part').value,
            checkboxState: {},
            righeAggiunte: [] 
        };
    
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            datiDaSalvare.checkboxState[checkbox.id] = checkbox.checked;
        });
    
        taskLists.forEach(taskList => {
            const categoria = taskList.parentNode.id;
            const tasks = [];
            taskList.querySelectorAll('li').forEach(task => {
                const taskImage = task.querySelector('img.task-img'); 
                tasks.push({
                    text: task.firstChild.textContent.trim(), 
                    completed: task.classList.contains('task-verde'), 
                    image: taskImage ? taskImage.src : null  
                });
            });
            datiDaSalvare.taskData[categoria] = tasks;
        });
    
        const righeAggiunte = document.querySelectorAll('.riga-aggiunta');
        righeAggiunte.forEach(riga => {
            const celle = Array.from(riga.querySelectorAll('td')).map(td => td.querySelector('input, textarea').value);
            datiDaSalvare.righeAggiunte.push(celle);  
        });
    
        return datiDaSalvare;
    }
    
    exportButton.addEventListener('click', function() {
        const dati = raccogliDati();
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');  
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
    
        const fileName = `checklist-${formattedDate}.json`;
        const blob = new Blob([JSON.stringify(dati, null, 2)], { type: 'application/json' });
        const file = new File([blob], fileName, { type: 'application/json' });
    
        if (isMobile) {
            apriModaleEsporta();
        } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;  
            a.click();
            URL.revokeObjectURL(url);  
            console.log('File salvato su PC');
        }
    
        downloadFileButton.addEventListener('click', function() {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
            exportModal.style.display = 'none'; 
        });
    
        shareFileButton.addEventListener('click', function() {
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: 'Esporta Dati App',
                    text: 'Ecco i dati esportati dall\'app',
                })
                .then(() => console.log('Condivisione avvenuta con successo!'))
                .catch((error) => console.log('Errore durante la condivisione:', error));
            } else {
                alert('La condivisione di file non è supportata sul tuo dispositivo!');
            }
            exportModal.style.display = 'none'; 
        });
      
        chiudiModalExportButton.addEventListener('click', function() {
            exportModal.style.display = 'none';  
        });
    });

    importButton.addEventListener('click', function() {
        importInput.click(); 
    });

    importInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const datiImportati = JSON.parse(e.target.result);
                caricaDati(datiImportati);
                localStorage.setItem('appData', JSON.stringify(datiImportati));
            };
            reader.readAsText(file);
        }
    });

    function caricaDati(dati) {
        commentiHome.value = dati.commentiHome;
        
        previsioniOrarieInputs.forEach((input, index) => {
            input.value = dati.previsioniOrarie[index];
        });
    
        obiettiviTurnoInputs.forEach((input, index) => {
            input.value = dati.obiettiviTurno[index];
        });
    
        if (dati.taskData) {
            for (const categoria in dati.taskData) {
                const taskList = document.querySelector(`#${categoria} .task-list`);
                dati.taskData[categoria].forEach(task => {
                    const newTask = document.createElement('li');
                    newTask.textContent = task.text;
                    newTask.classList.add('task');
                    if (task.completed) {
                        newTask.classList.add('task-verde');
                    } else {
                        newTask.classList.add('task-rossa');
                    }
    
                    if (task.image) {
                        const taskImage = document.createElement('img');
                        taskImage.src = task.image;  
                        taskImage.classList.add('task-img');
                        taskImage.style.width = '50px';
                        taskImage.style.height = 'auto';
                        newTask.appendChild(taskImage); 
    
                        taskImage.addEventListener('click', function(event) {
                            event.stopPropagation();
                            modalImage.src = task.image;
                            apriModal(imageModal);  
                        });
                    }
    
                    aggiungiEventiTask(newTask);
                    taskList.appendChild(newTask); 
                });
            }
        }
    
        postTurnoCommenti.forEach((commento, index) => {
            commento.value = dati.postTurnoCommenti[index];
        });
    
        document.getElementById('manager-name').value = dati.managerName || '';
        document.getElementById('data-turno').value = dati.dataTurno || '';
        document.getElementById('shift-part').value = dati.shiftPart || '';
    
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = dati.checkboxState[checkbox.id] || false;
        });
    }
    
    function mostraSezione(sezioneId) {
        sezioni.forEach(sezione => {
            sezione.style.display = (sezione.id === sezioneId) ? 'block' : 'none';
        });
    }

    function mostraComponentiArea(areaId) {
        componentiAree.forEach(area => {
            area.style.display = (area.id === areaId) ? 'block' : 'none';
        });
    }

    homeLink.addEventListener('click', function() {
        mostraSezione('home-sezione');
    });
    
    previsioniLink.addEventListener('click', function() {
        mostraSezione('previsioni-orarie-sezione');
    });
 
    produzioneLink.addEventListener('click', function() {
        mostraSezione('aree-produzione-sezione');
    });
    
    areaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const areaId = button.getAttribute('data-area');
            const areaElement = document.getElementById(areaId);
    
            
            componentiAree.forEach(area => {
                if (area !== areaElement) {
                    area.style.display = 'none';
                }
            });
    
            
            if (areaElement.style.display === 'none' || areaElement.style.display === '') {
                areaElement.style.display = 'block';
            } else {
                areaElement.style.display = 'none';
            }
        });
    });

    
    const postTurnoLink = document.getElementById('post-turno-page');
    
    postTurnoLink.addEventListener('click', function() {
        mostraSezione('post-turno-sezione');
    });
  
    taskPageLink.addEventListener('click', function() {
        mostraSezione('task-page-sezione');
    });
  
    addTaskButton.addEventListener('click', function() {
        taskDaAggiungere = taskInput.value;
        if (taskDaAggiungere.trim() !== '') {
            categoriaContainer.style.display = 'block';  
        } else {
            alert('Inserisci una task valida.');
        }
    });

    confermaCategoriaButton.addEventListener('click', function() {
        const categoria = categoriaSelect.value;
        const taskList = document.querySelector(`#${categoria} .task-list`);
        const newTask = document.createElement('li');
        newTask.textContent = taskDaAggiungere;
        newTask.classList.add('task', 'task-rossa'); 
    
        newTask.addEventListener('click', function() {
            currentTask = newTask;  
            taskModal.style.display = 'block';  
        });
        
        aggiungiEventiTask(newTask);
    
        taskList.appendChild(newTask);
        categoriaContainer.style.display = 'none';  
        taskInput.value = '';  
        salvaDatiLocali();
    });
        
    modificaTaskButton.addEventListener('click', function() {
        const nuovoTesto = prompt('Inserisci il nuovo testo per la task:', currentTask.textContent);
        if (nuovoTesto) {
            currentTask.textContent = nuovoTesto;
            taskModal.style.display = 'none';  
            salvaDatiLocali();
        }
    });
  
    function aggiungiEventiTask(task) {
      task.addEventListener('click', function() {
          currentTask = task;  
  
          if (task.classList.contains('task-verde')) {
              scattaFotoButton.style.display = 'none';
              completaTaskButton.style.display = 'none'; 
          } else {
              scattaFotoButton.style.display = 'inline-block';
              completaTaskButton.style.display = 'inline-block'; 
          }
          setCurrentTask(task); 
          taskModal.style.display = 'block';  
      });
    }
    
    completaTaskButton.addEventListener('click', function() {
        const commento = prompt('Inserisci un commento per la task completata:');
        if (commento) {
            currentTask.textContent += ` (Completata: ${commento})`;
            currentTask.classList.remove('task-rossa');
            currentTask.classList.add('task-verde');  
            completaTaskButton.style.display = 'none'; 
            taskModal.style.display = 'none';  
    
            
            salvaDatiLocali();
        }
    });
    
    
    eliminaTaskButton.addEventListener('click', function() {
        if (currentTask) {
            currentTask.remove();  
            taskModal.style.display = 'none';  
    
            
            salvaDatiLocali();
        }
    });
    
    
    searchTaskInput.addEventListener('input', function() {
        const searchTerm = searchTaskInput.value.toLowerCase();
        taskLists.forEach(taskList => {
            const tasks = taskList.querySelectorAll('li');
            tasks.forEach(task => {
                const taskText = task.textContent.toLowerCase();
                task.style.display = taskText.includes(searchTerm) ? '' : 'none';
            });
        });
    });
    
    
    deleteAllButton.addEventListener('click', function() {
        taskLists.forEach(taskList => {
            taskList.innerHTML = '';  
        });

        salvaDatiLocali();
    });
    
    

    
    function apriModal(modal) {
        modal.style.display = 'block';
    }

    
    function chiudiModal(modal) {
        modal.style.display = 'none';
    }
    
    chiudiModalButton.addEventListener('click', function() {
        taskModal.style.display = 'none';  
    });

    mostraSezione('home-sezione');
    
    const aggiungiRigaButton = document.getElementById('aggiungi-riga');
    const tabellaPicchi = document.getElementById('tabella-obiettivi').getElementsByTagName('tbody')[0];

    aggiungiRigaButton.addEventListener('click', function() {
        const nuovaRiga = document.createElement('tr');
        const titleobjCell = document.createElement('td');
        const trendCell = document.createElement('td');
        const objCell = document.createElement('td');
        const realCell = document.createElement('td');
        nuovaRiga.classList.add('riga-aggiunta');

        
        titleobjCell.innerHTML = '<input type="text" maxlength="20" placeholder="Inserisci testo...">';
        trendCell.innerHTML = '<textarea rows="2" placeholder="Inserisci commento..."></textarea>';
        objCell.innerHTML = '<textarea rows="2" placeholder="Inserisci commento..."></textarea>';
        realCell.innerHTML = '<textarea rows="2" placeholder="Inserisci commento..."></textarea>';
        
        nuovaRiga.appendChild(titleobjCell);
        nuovaRiga.appendChild(trendCell);
        nuovaRiga.appendChild(objCell);
        nuovaRiga.appendChild(realCell);

    
        tabellaPicchi.appendChild(nuovaRiga);
    });
    
    function caricaDatiLocali() {
        const datiSalvati = JSON.parse(localStorage.getItem('appData')) || {};

        
        if (datiSalvati.managerName) {
            managerNameInput.value = datiSalvati.managerName;
        }
        if (datiSalvati.dataTurno) {
            dataTurnoInput.value = datiSalvati.dataTurno;
        }
        if (datiSalvati.shiftPart) {
            shiftPartInput.value = datiSalvati.shiftPart;
        }

        
        if (datiSalvati.checkboxState) {
            checkboxInputs.forEach(checkbox => {
                if (datiSalvati.checkboxState[checkbox.id] !== undefined) {
                    checkbox.checked = datiSalvati.checkboxState[checkbox.id];
                }
            });
        }

        
        if (datiSalvati.commentiHome) {
            commentiHome.value = datiSalvati.commentiHome;
        }

        
        if (datiSalvati.previsioniOrarie) {
            previsioniOrarieInputs.forEach((input, index) => {
                input.value = datiSalvati.previsioniOrarie[index] || '';
            });
        }

        
        if (datiSalvati.obiettiviTurno) {
            obiettiviTurnoInputs.forEach((input, index) => {
                input.value = datiSalvati.obiettiviTurno[index] || '';
            });
        }

    
        if (datiSalvati.taskData) {
            for (const categoria in datiSalvati.taskData) {
                const taskList = document.querySelector(`#${categoria} .task-list`); 
                datiSalvati.taskData[categoria].forEach(task => {
                    const newTask = document.createElement('li');
                    newTask.textContent = task.text;
                    newTask.classList.add('task');
                    if (task.completed) {
                        newTask.classList.add('task-verde'); 
                    } else {
                        newTask.classList.add('task-rossa'); 
                    }

                    
                    if (task.image) {
                        const taskImage = document.createElement('img');
                        taskImage.src = task.image;  
                        taskImage.classList.add('task-img');
                        taskImage.style.width = '50px';
                        taskImage.style.height = 'auto';
                        newTask.appendChild(taskImage);  

                        
                        taskImage.addEventListener('click', function(event) {
                            event.stopPropagation();
                            modalImage.src = task.image;
                            apriModal(imageModal);
                        });
                    }
                  
                    
                    aggiungiEventiTask(newTask);

                    
                    taskList.appendChild(newTask);
                });
            }
        }

        
        if (datiSalvati.postTurnoCommenti) {
            postTurnoCommenti.forEach((commento, index) => {
                commento.value = datiSalvati.postTurnoCommenti[index] || '';
            });
        }
    }

    
    function salvaDatiLocali() {
        const datiDaSalvare = {
            commentiHome: commentiHome.value,
            previsioniOrarie: Array.from(previsioniOrarieInputs).map(input => input.value),
            obiettiviTurno: Array.from(obiettiviTurnoInputs).map(input => input.value),
            taskData: {},
            postTurnoCommenti: Array.from(postTurnoCommenti).map(commento => commento.value),
            managerName: managerNameInput.value,
            dataTurno: dataTurnoInput.value,
            shiftPart: shiftPartInput.value,
            checkboxState: {}
        };
        
        
        checkboxInputs.forEach(checkbox => {
            datiDaSalvare.checkboxState[checkbox.id] = checkbox.checked;
        });
      
        taskLists.forEach(taskList => {
            const categoria = taskList.parentNode.id;
            const tasks = [];
            taskList.querySelectorAll('li').forEach(task => {
                const taskImage = task.querySelector('img.task-img');  
                tasks.push({
                    text: task.firstChild.textContent,  
                    completed: task.classList.contains('task-verde'),  
                    image: taskImage ? taskImage.src : null  
                });
            });
            datiDaSalvare.taskData[categoria] = tasks;
        });
        localStorage.setItem('appData', JSON.stringify(datiDaSalvare));
    }


    commentiHome.addEventListener('input', salvaDatiLocali);
    previsioniOrarieInputs.forEach(input => input.addEventListener('input', salvaDatiLocali));
    obiettiviTurnoInputs.forEach(input => input.addEventListener('input', salvaDatiLocali));
    postTurnoCommenti.forEach(commento => commento.addEventListener('input', salvaDatiLocali));
    managerNameInput.addEventListener('input', salvaDatiLocali);
    dataTurnoInput.addEventListener('change', salvaDatiLocali);
    shiftPartInput.addEventListener('input', salvaDatiLocali);
    checkboxInputs.forEach(checkbox => {
        checkbox.addEventListener('change', salvaDatiLocali);
    });

    caricaDatiLocali();
  
    function calcolaStime(gcS, mfy, instore, drive, delivery, patate, bevcell, stimaIds, piccoIds, gcSPicchi, mfyPicchi, instorePicchi, drivePicchi, deliveryPicchi) {
        
        const stimaMfy = parseInt(Math.round(gcS * mfy)); 
        const stimaInstore = parseInt(Math.round((gcS * instore)/100)); 
        const stimaDrive = parseInt(Math.round((gcS * drive)/100));
        const stimaDelivery = parseInt(Math.round((gcS * delivery)/100)); 
        const stimaPatate = parseInt(Math.round(gcS * patate)); 
        const stimaBevcell = parseInt(Math.round(gcS * bevcell)); 

        document.getElementById(stimaIds[1]).value = stimaMfy;
        document.getElementById(stimaIds[2]).value = stimaInstore;
        document.getElementById(stimaIds[3]).value = stimaDrive;
        document.getElementById(stimaIds[4]).value = stimaDelivery;
        document.getElementById(stimaIds[5]).value = stimaPatate;
        document.getElementById(stimaIds[6]).value = stimaBevcell;

        
        const piccoGcS = parseInt(Math.round((gcS * gcSPicchi)/100)); 
        const piccoMfy = parseInt(Math.round((stimaMfy * mfyPicchi)/100)); 
        const piccoInstore = parseInt(Math.round((stimaInstore * instorePicchi)/100)); 
        const piccoDrive = parseInt(Math.round((stimaDrive * drivePicchi)/100)); 
        const piccoDelivery = parseInt(Math.round((stimaDelivery * deliveryPicchi)/100)); 

        document.getElementById(piccoIds[0]).value = piccoGcS;
        document.getElementById(piccoIds[1]).value = piccoMfy;
        document.getElementById(piccoIds[2]).value = piccoInstore;
        document.getElementById(piccoIds[3]).value = piccoDrive;
        document.getElementById(piccoIds[4]).value = piccoDelivery;

        salvaDatiLocali();
    }


    document.getElementById('calcola-btn-1').addEventListener('click', function() {
        const gcS = parseFloat(document.getElementById('gcs-stima-1').value);
        const mfy = parseFloat(document.getElementById('mfy-input').value);
        const instore = parseFloat(document.getElementById('instore-input').value);
        const drive = parseFloat(document.getElementById('drive-input').value);
        const delivery = parseFloat(document.getElementById('delivery-input').value);
        const patate = parseFloat(document.getElementById('patate-input').value);
        const bevcell = parseFloat(document.getElementById('bevcell-input').value);

        
        const gcSPicchi = parseFloat(document.getElementById('gcspicchi-input').value);
        const mfyPicchi = parseFloat(document.getElementById('mfypicchi-input').value);
        const instorePicchi = parseFloat(document.getElementById('instorepicchi-input').value);
        const drivePicchi = parseFloat(document.getElementById('drivepicchi-input').value);
        const deliveryPicchi = parseFloat(document.getElementById('deliverypicchi-input').value);

        calcolaStime(gcS, mfy, instore, drive, delivery, patate, bevcell, [
            'gcs-stima-1', 'mfy-stima-1', 'inst-stima-1', 'auto-stima-1', 'mcdel-stima-1', 'patate-stima-1', 'bevcell-stima-1'
        ], ['gcs-picco-1', 'mfy-picco-1', 'inst-picco-1', 'auto-picco-1', 'mcdel-picco-1'], gcSPicchi, mfyPicchi, instorePicchi, drivePicchi, deliveryPicchi);
    });

    document.getElementById('calcola-btn-2').addEventListener('click', function() {
        const gcS = parseFloat(document.getElementById('gcs-stima-2').value);
        const mfy = parseFloat(document.getElementById('mfy-input').value);
        const instore = parseFloat(document.getElementById('instore-input').value);
        const drive = parseFloat(document.getElementById('drive-input').value);
        const delivery = parseFloat(document.getElementById('delivery-input').value);
        const patate = parseFloat(document.getElementById('patate-input').value);
        const bevcell = parseFloat(document.getElementById('bevcell-input').value);

        
        const gcSPicchi = parseFloat(document.getElementById('gcspicchi-input').value);
        const mfyPicchi = parseFloat(document.getElementById('mfypicchi-input').value);
        const instorePicchi = parseFloat(document.getElementById('instorepicchi-input').value);
        const drivePicchi = parseFloat(document.getElementById('drivepicchi-input').value);
        const deliveryPicchi = parseFloat(document.getElementById('deliverypicchi-input').value);

        calcolaStime(gcS, mfy, instore, drive, delivery, patate, bevcell, [
            'gcs-stima-2', 'mfy-stima-2', 'inst-stima-2', 'auto-stima-2', 'mcdel-stima-2', 'patate-stima-2', 'bevcell-stima-2'
        ], ['gcs-picco-2', 'mfy-picco-2', 'inst-picco-2', 'auto-picco-2', 'mcdel-picco-2'], gcSPicchi, mfyPicchi, instorePicchi, drivePicchi, deliveryPicchi);
    });

    document.getElementById('calcola-btn-3').addEventListener('click', function() {
        const gcS = parseFloat(document.getElementById('gcs-stima-3').value);
        const mfy = parseFloat(document.getElementById('mfy-input').value);
        const instore = parseFloat(document.getElementById('instore-input').value);
        const drive = parseFloat(document.getElementById('drive-input').value);
        const delivery = parseFloat(document.getElementById('delivery-input').value);
        const patate = parseFloat(document.getElementById('patate-input').value);
        const bevcell = parseFloat(document.getElementById('bevcell-input').value);

        
        const gcSPicchi = parseFloat(document.getElementById('gcspicchi-input').value);
        const mfyPicchi = parseFloat(document.getElementById('mfypicchi-input').value);
        const instorePicchi = parseFloat(document.getElementById('instorepicchi-input').value);
        const drivePicchi = parseFloat(document.getElementById('drivepicchi-input').value);
        const deliveryPicchi = parseFloat(document.getElementById('deliverypicchi-input').value);

        calcolaStime(gcS, mfy, instore, drive, delivery, patate, bevcell, [
            'gcs-stima-3', 'mfy-stima-3', 'inst-stima-3', 'auto-stima-3', 'mcdel-stima-3', 'patate-stima-3', 'bevcell-stima-3'
        ], ['gcs-picco-3', 'mfy-picco-3', 'inst-picco-3', 'auto-picco-3', 'mcdel-picco-3'], gcSPicchi, mfyPicchi, instorePicchi, drivePicchi, deliveryPicchi);
    });
  
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').checked = true;
    }
    
    document.getElementById('theme-toggle').addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });
  
     scattaFotoButton.addEventListener('click', function() {
        taskImageInput.click();  
    });

    taskImageInput.addEventListener('change', function(event) {
        const file = event.target.files[0]; 
        if (file && currentTask) {
            const reader = new FileReader();
            reader.onload = function(e) {
                let taskImage = currentTask.querySelector('img.task-img');
                if (!taskImage) {
                    taskImage = document.createElement('img');
                    taskImage.classList.add('task-img');
                    taskImage.style.width = '50px';
                    taskImage.style.height = 'auto';
                    currentTask.appendChild(taskImage);  
                }

                taskImage.src = e.target.result;
                taskImage.style.display = 'inline'; 

                taskImage.addEventListener('click', function(event) {
                    event.stopPropagation();
                    modalImage.src = e.target.result;
                    apriModal(imageModal);  
                });

                
                salvaDatiLocali();
            };
            reader.readAsDataURL(file);  
        }
    });

    function setCurrentTask(taskElement) {
        currentTask = taskElement;  
    }
    
    chiudiModalButton.addEventListener('click', function() {
        taskModal.style.display = 'none';  
    });

    chiudiImmagine.addEventListener('click', function() {
        chiudiModal(imageModal);  
    });

    window.addEventListener('click', function(event) {
        if (event.target === imageModal) {
            chiudiModal(imageModal); 
        }
    });

    /////////// SALVA PDF
    const checkboxMapping = [
        { htmlId: 'allestimento-linee', pdfField: 'CheckBox1' },
        { htmlId: 'scadenze-secondarie', pdfField: 'CheckBox5' },
        { htmlId: 'tavoli-preparazione', pdfField: 'CheckBox2' },
        { htmlId: 'e-production', pdfField: 'CheckBox6' },
        { htmlId: 'verifica-compressione-toaster', pdfField: 'CheckBox3' },
        { htmlId: 'small-equipment', pdfField: 'CheckBox4' },
        { htmlId: 'monitor-look-bump-cook', pdfField: 'CheckBox7' },
        { htmlId: 'verifica-co2', pdfField: 'CheckBox8' },
        { htmlId: 'sistema-monitor-drive-delivery', pdfField: 'CheckBox9' },
        { htmlId: 'corsia-esterna', pdfField: 'CheckBox10' },
        { htmlId: 'macinino-macchina', pdfField: 'CheckBox11' },
        { htmlId: 'vetrina', pdfField: 'CheckBox12' },
        { htmlId: 'vassoi', pdfField: 'CheckBox21' },
        { htmlId: 'complementi-servizio-famiglie', pdfField: 'CheckBox22' },
        { htmlId: 'tavoli-assemblaggio', pdfField: 'CheckBox23' },
        { htmlId: 'numeri-sat', pdfField: 'CheckBox24' },
        { htmlId: 'kiosk', pdfField: 'CheckBox25' },
        { htmlId: 'lavaggio', pdfField: 'CheckBox26' },
        { htmlId: 'secchi-panni ', pdfField: 'CheckBox27' },
        { htmlId: 'celle-fifo', pdfField: 'CheckBox28' },
        { htmlId: 'magazzino-fifo', pdfField: 'CheckBox29' },
        { htmlId: 'crewroom-ufficio-spogliatoi', pdfField: 'CheckBox30' },
        { htmlId: 'pavimenti', pdfField: 'CheckBox13' },
        { htmlId: 'uscite-emergenza', pdfField: 'CheckBox14' },
        { htmlId: 'maniglioni', pdfField: 'CheckBox15' },
        { htmlId: 'macchinari', pdfField: 'CheckBox16' },
        { htmlId: 'cavi', pdfField: 'CheckBox17' },
        { htmlId: 'centralina', pdfField: 'CheckBox18' },
        { htmlId: 'dpi', pdfField: 'CheckBox19' },
        { htmlId: 'trasporto-merci', pdfField: 'CheckBox20' },
    ];

    const timeMapping = [
        { htmlId: 'gcs-stima-1', pdfField: 'stima1-1'},
        { htmlId: 'sales-stima-1', pdfField: 'stima1-2'},
        { htmlId: 'mfy-stima-1', pdfField: 'stima1-3'},
        { htmlId: 'inst-stima-1', pdfField: 'stima1-4'},
        { htmlId: 'auto-stima-1', pdfField: 'stima1-5'},
        { htmlId: 'mcdel-stima-1', pdfField: 'stima1-6'},
        { htmlId: 'patate-stima-1', pdfField: 'stima1-7'},
        { htmlId: 'bevcell-stima-1', pdfField: 'stima1-8'},
        { htmlId: 'gcs-reale-1', pdfField: 'reale1-1'},
        { htmlId: 'sales-reale-1', pdfField: 'reale1-2'},
        { htmlId: 'mfy-reale-1', pdfField: 'reale1-3'},
        { htmlId: 'inst-reale-1', pdfField: 'reale1-4'},
        { htmlId: 'auto-reale-1', pdfField: 'reale1-5'},
        { htmlId: 'mcdel-reale-1', pdfField: 'reale1-6'},
        { htmlId: 'patate-reale-1', pdfField: 'reale1-7'},
        { htmlId: 'bevcell-reale-1', pdfField: 'reale1-8'},
        { htmlId: 'gcs-picco-1', pdfField: 'picco1-1'},
        { htmlId: 'sales-picco-1', pdfField: 'picco1-2'},
        { htmlId: 'mfy-picco-1', pdfField: 'picco1-3'},
        { htmlId: 'inst-picco-1', pdfField: 'picco1-4'},
        { htmlId: 'auto-picco-1', pdfField: 'picco1-5'},
        { htmlId: 'mcdel-picco-1', pdfField: 'picco1-6'},
        { htmlId: 'patate-picco-1', pdfField: 'picco1-7'},
        { htmlId: 'bevcell-picco-1', pdfField: 'picco1-8'},
        { htmlId: 'gcs-piccoreale-1', pdfField: 'piccoreale1-1'},
        { htmlId: 'sales-piccoreale-1', pdfField: 'piccoreale1-2'},
        { htmlId: 'mfy-piccoreale-1', pdfField: 'piccoreale1-3'},
        { htmlId: 'inst-piccoreale-1', pdfField: 'piccoreale1-4'},
        { htmlId: 'auto-piccoreale-1', pdfField: 'piccoreale1-5'},
        { htmlId: 'mcdel-piccoreale-1', pdfField: 'piccoreale1-6'},
        { htmlId: 'patate-piccoreale-1', pdfField: 'piccoreale1-7'},
        { htmlId: 'bevcell-piccoreale-1', pdfField: 'piccoreale1-8'},
        //
        { htmlId: 'gcs-stima-2', pdfField: 'stima2-1'},
        { htmlId: 'sales-stima-2', pdfField: 'stima2-2'},
        { htmlId: 'mfy-stima-2', pdfField: 'stima2-3'},
        { htmlId: 'inst-stima-2', pdfField: 'stima2-4'},
        { htmlId: 'auto-stima-2', pdfField: 'stima2-5'},
        { htmlId: 'mcdel-stima-2', pdfField: 'stima2-6'},
        { htmlId: 'patate-stima-2', pdfField: 'stima2-7'},
        { htmlId: 'bevcell-stima-2', pdfField: 'stima2-8'},
        { htmlId: 'gcs-reale-2', pdfField: 'reale2-1'},
        { htmlId: 'sales-reale-2', pdfField: 'reale2-2'},
        { htmlId: 'mfy-reale-2', pdfField: 'reale2-3'},
        { htmlId: 'inst-reale-2', pdfField: 'reale2-4'},
        { htmlId: 'auto-reale-2', pdfField: 'reale2-5'},
        { htmlId: 'mcdel-reale-2', pdfField: 'reale2-6'},
        { htmlId: 'patate-reale-2', pdfField: 'reale2-7'},
        { htmlId: 'bevcell-reale-2', pdfField: 'reale2-8'},
        { htmlId: 'gcs-picco-2', pdfField: 'picco2-1'},
        { htmlId: 'sales-picco-2', pdfField: 'picco2-2'},
        { htmlId: 'mfy-picco-2', pdfField: 'picco2-3'},
        { htmlId: 'inst-picco-2', pdfField: 'picco2-4'},
        { htmlId: 'auto-picco-2', pdfField: 'picco2-5'},
        { htmlId: 'mcdel-picco-2', pdfField: 'picco2-6'},
        { htmlId: 'patate-picco-2', pdfField: 'picco2-7'},
        { htmlId: 'bevcell-picco-2', pdfField: 'picco2-8'},
        { htmlId: 'gcs-piccoreale-2', pdfField: 'piccoreale2-1'},
        { htmlId: 'sales-piccoreale-2', pdfField: 'piccoreale2-2'},
        { htmlId: 'mfy-piccoreale-2', pdfField: 'piccoreale2-3'},
        { htmlId: 'inst-piccoreale-2', pdfField: 'piccoreale2-4'},
        { htmlId: 'auto-piccoreale-2', pdfField: 'piccoreale2-5'},
        { htmlId: 'mcdel-piccoreale-2', pdfField: 'piccoreale2-6'},
        { htmlId: 'patate-piccoreale-2', pdfField: 'piccoreale2-7'},
        { htmlId: 'bevcell-piccoreale-2', pdfField: 'piccoreale2-8'},
        //
        { htmlId: 'gcs-stima-3', pdfField: 'stima3-1'},
        { htmlId: 'sales-stima-3', pdfField: 'stima3-2'},
        { htmlId: 'mfy-stima-3', pdfField: 'stima3-3'},
        { htmlId: 'inst-stima-3', pdfField: 'stima3-4'},
        { htmlId: 'auto-stima-3', pdfField: 'stima3-5'},
        { htmlId: 'mcdel-stima-3', pdfField: 'stima3-6'},
        { htmlId: 'patate-stima-3', pdfField: 'stima3-7'},
        { htmlId: 'bevcell-stima-3', pdfField: 'stima3-8'},
        { htmlId: 'gcs-reale-3', pdfField: 'reale3-1'},
        { htmlId: 'sales-reale-3', pdfField: 'reale3-2'},
        { htmlId: 'mfy-reale-3', pdfField: 'reale3-3'},
        { htmlId: 'inst-reale-3', pdfField: 'reale3-4'},
        { htmlId: 'auto-reale-3', pdfField: 'reale3-5'},
        { htmlId: 'mcdel-reale-3', pdfField: 'reale3-6'},
        { htmlId: 'patate-reale-3', pdfField: 'reale3-7'},
        { htmlId: 'bevcell-reale-3', pdfField: 'reale3-8'},
        { htmlId: 'gcs-picco-3', pdfField: 'picco3-1'},
        { htmlId: 'sales-picco-3', pdfField: 'picco3-2'},
        { htmlId: 'mfy-picco-3', pdfField: 'picco3-3'},
        { htmlId: 'inst-picco-3', pdfField: 'picco3-4'},
        { htmlId: 'auto-picco-3', pdfField: 'picco3-5'},
        { htmlId: 'mcdel-picco-3', pdfField: 'picco3-6'},
        { htmlId: 'patate-picco-3', pdfField: 'picco3-7'},
        { htmlId: 'bevcell-picco-3', pdfField: 'picco3-8'},
        { htmlId: 'gcs-piccoreale-3', pdfField: 'piccoreale3-1'},
        { htmlId: 'sales-piccoreale-3', pdfField: 'piccoreale3-2'},
        { htmlId: 'mfy-piccoreale-3', pdfField: 'piccoreale3-3'},
        { htmlId: 'inst-piccoreale-3', pdfField: 'piccoreale3-4'},
        { htmlId: 'auto-piccoreale-3', pdfField: 'piccoreale3-5'},
        { htmlId: 'mcdel-piccoreale-3', pdfField: 'piccoreale3-6'},
        { htmlId: 'patate-piccoreale-3', pdfField: 'piccoreale3-7'},
        { htmlId: 'bevcell-piccoreale-3', pdfField: 'piccoreale3-8'},
    ]

    const categories = [
        { id: 'sicurezza-food-safety', pdfField: 'sicurezza-food' },
        { id: 'sicurezza-decreto-81', pdfField: 'sicurezza-decreto81' },
        { id: 'qualita-servizio', pdfField: 'qualità-servizio' },
        { id: 'comfort', pdfField: 'comfort' },
        { id: 'aspetto', pdfField: 'aspetto' }
    ];

    const postTurnoFields = [
        { htmlId: 'obiettivi-raggiunti', pdfField: 'obbiettivi' },
        { htmlId: 'colli-bottiglia', pdfField: 'colli' },
        { htmlId: 'diverso-problematiche', pdfField: 'considerazioni-finali' }
    ];

    document.getElementById('generate-pdf').addEventListener('click', async function () {
        
        const pdfUrl = 'check-list.pdf'; 
        const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();
      
        const managerName = document.getElementById('manager-name').value || "";
        const shiftDate = document.getElementById('data-turno').value || "";
        const shiftPart = document.getElementById('shift-part').value || "";

        
        form.getTextField('manager').setText(managerName);
        form.getTextField('data').setText(shiftDate);
        form.getTextField('daypart').setText(shiftPart);

        checkboxMapping.forEach(({ htmlId, pdfField }) => {
            const checkbox = document.getElementById(htmlId);
            if (checkbox && checkbox.checked) {
                form.getCheckBox(pdfField).check();  
            }
        });

        timeMapping.forEach(({ htmlId, pdfField }) => {
            const timeInput = document.getElementById(htmlId);
            if (timeInput) {
                form.getTextField(pdfField).setText(timeInput.value || "");
            }
        });

        const tableRows = document.querySelectorAll('#tabella-obiettivi tr:not(:first-child)');
        const maxRows = 9;

        tableRows.forEach((row, index) => {
            if (index < maxRows) { 
                const cells = row.querySelectorAll('td');
    
                
                const titolo = cells[0].querySelector('input') ? cells[0].querySelector('input').value : cells[0].innerText;
                const trend = cells[1].querySelector('textarea') ? cells[1].querySelector('textarea').value : cells[1].innerText;
                const obj = cells[2].querySelector('textarea') ? cells[2].querySelector('textarea').value : cells[2].innerText;
                const real = cells[3].querySelector('textarea') ? cells[3].querySelector('textarea').value : cells[3].innerText;
    
                
                if (form.getTextField(`performance-${index + 1}`)) {
                    form.getTextField(`performance-${index + 1}`).setText(titolo);
                }
                if (form.getTextField(`trend-${index + 1}`)) {
                    form.getTextField(`trend-${index + 1}`).setText(trend);
                }
                if (form.getTextField(`obj-${index + 1}`)) {
                    form.getTextField(`obj-${index + 1}`).setText(obj);
                }
                if (form.getTextField(`real-${index + 1}`)) {
                    form.getTextField(`real-${index + 1}`).setText(real);
                }
            }
        });

        categories.forEach(({ id, pdfField }) => {
            const categoryElement = document.getElementById(id);
            const taskList = categoryElement.querySelectorAll('.task-list li');
    
            let taskText = "";
            taskList.forEach((task, index) => {
                taskText += `${index + 1}. ${task.innerText}\n`;
            });
    
            
            if (form.getTextField(pdfField)) {
                form.getTextField(pdfField).setText(taskText || "");
            }
        });

        postTurnoFields.forEach(({ htmlId, pdfField }) => {
            const commentBox = document.getElementById(htmlId);
            const commentText = commentBox ? commentBox.value.trim() : "";
    
            if (form.getTextField(pdfField)) {
                form.getTextField(pdfField).setText(commentText);
            }
        });

        const pdfBytes = await pdfDoc.save();
    
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = `Checklist_Turno_${shiftDate}.pdf`;
        a.click();
    });

});
