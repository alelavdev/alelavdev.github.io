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
    let currentTask = null; // Memorizza la task corrente
    const taskImageInput = document.createElement('input');  // Input invisibile per scattare la foto
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
    const commentiHome = document.getElementById('commenti-analisi'); // Per i commenti nella home
    const previsioniOrarieInputs = document.querySelectorAll('.previsioni-input'); // Tutti gli input nella pagina previsioni orarie
    const obiettiviTurnoInputs = document.querySelectorAll('.obiettivi-input'); // Tutti gli input degli obiettivi turno
    const postTurnoCommenti = document.querySelectorAll('.post-turno-commenti'); // Commenti nella pagina post turno
    const exportButton = document.getElementById('export-button');
    const importButton = document.getElementById('import-button');
    const importInput = document.getElementById('import-input');
    const exportModal = document.getElementById('export-modal');
    const downloadFileButton = document.getElementById('download-file');
    const shareFileButton = document.getElementById('share-file');
    const chiudiModalExportButton = document.getElementById('chiudi-modal-export');
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
    // Selettori per tutti i campi di input, textarea e checkbox
    const inputFields = document.querySelectorAll('input[type="text"], input[type="date"], input[type="number"], textarea');
    const checkboxFields = document.querySelectorAll('input[type="checkbox"]');
    // Pulsante "Cancella Tutto"
    const clearAllButton = document.getElementById('clear-all-button');
    const documentazioneLink = document.getElementById('documentazione-page');

    // Event listener per la pagina Documentazione
    documentazioneLink.addEventListener('click', function() {
        mostraSezione('documentazione-sezione');
    });
  
    // Funzione per cancellare tutti i campi
    function cancellaTutto() {
        // Cancella tutti gli input di testo, data, numeri e textarea
        inputFields.forEach(field => {
            field.value = '';
        });
    
        // Deseleziona tutte le checkbox
        checkboxFields.forEach(checkbox => {
            checkbox.checked = false;
        });
      
        // Rimuovi tutte le righe aggiunte in "Obiettivi del Turno - Tabella 4"
        const righeAggiunte = document.querySelectorAll('.riga-aggiunta');
        righeAggiunte.forEach(riga => {
            riga.remove(); // Rimuove la riga dalla tabella
        });
    
        // Cancella anche le task salvate localmente, se necessario
        localStorage.clear();  // Questo cancella tutti i dati salvati localmente
        salvaDatiLocali();  // Se hai bisogno di ripristinare lo stato subito dopo
    }
    
    // Aggiungi un event listener al pulsante per la cancellazione
    clearAllButton.addEventListener('click', function() {
        if (confirm('Sei sicuro di voler cancellare tutti i dati?')) {
            cancellaTutto();  // Esegui la funzione di cancellazione
        }
    });
  
    // Funzione per aprire il modale di esportazione
    function apriModaleEsporta() {
        exportModal.style.display = 'block'; // Mostra il modale
    }
  
    // Funzione per chiudere il modale di esportazione
    chiudiModalExportButton.addEventListener('click', function() {
        exportModal.style.display = 'none';   // Nascondi il modale
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
            righeAggiunte: []  // Aggiungi questa riga per le righe aggiunte
        };
    
        // Salva lo stato delle checkbox
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            datiDaSalvare.checkboxState[checkbox.id] = checkbox.checked;
        });
    
        // Salva le task
        taskLists.forEach(taskList => {
            const categoria = taskList.parentNode.id;
            const tasks = [];
            taskList.querySelectorAll('li').forEach(task => {
                const taskImage = task.querySelector('img.task-img');  // Recupera l'immagine se presente
                tasks.push({
                    text: task.firstChild.textContent.trim(),  // Salva il testo della task
                    completed: task.classList.contains('task-verde'),  // Controlla se la task è completata
                    image: taskImage ? taskImage.src : null  // Salva l'immagine come base64
                });
            });
            datiDaSalvare.taskData[categoria] = tasks;
        });
    
        // Salva le righe aggiunte
        const righeAggiunte = document.querySelectorAll('.riga-aggiunta');
        righeAggiunte.forEach(riga => {
            const celle = Array.from(riga.querySelectorAll('td')).map(td => td.querySelector('input, textarea').value);
            datiDaSalvare.righeAggiunte.push(celle);  // Salva i valori di ciascuna cella
        });
    
        return datiDaSalvare;
    }
    
    // Funzione per esportare il file JSON
    exportButton.addEventListener('click', function() {
        const dati = raccogliDati();
        // Formatta la data attuale in yyyy-mm-dd
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');  // Mesi da 0 a 11, aggiungi uno e formatta con 2 cifre
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
    
        // Definisci il nome del file
        const fileName = `checklist-${formattedDate}.json`;
        const blob = new Blob([JSON.stringify(dati, null, 2)], { type: 'application/json' });
        const file = new File([blob], fileName, { type: 'application/json' });
    
        if (isMobile) {
            // Se l'utente è su mobile, apri il modale per scegliere tra scaricare o condividere
            apriModaleEsporta();
        } else {
            // Se l'utente è su PC, esegui il download direttamente
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;  // Nome del file JSON
            a.click();
            URL.revokeObjectURL(url);  // Libera l'URL
            console.log('File salvato su PC');
        }
    
        // Scarica il file su richiesta
        downloadFileButton.addEventListener('click', function() {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
            exportModal.style.display = 'none'; // Nascondi il modale dopo il download
        });
    
        // Condividi il file su richiesta
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
            exportModal.style.display = 'none'; // Nascondi il modale dopo la condivisione
        });
      
        chiudiModalExportButton.addEventListener('click', function() {
            exportModal.style.display = 'none';  // Chiude il modal senza fare nulla
        });
    });


    // Funzione per caricare i dati dal file JSON
    importButton.addEventListener('click', function() {
        importInput.click(); // Attiva il campo di input file nascosto
    });

    // Funzione per importare i dati dal file
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
        // Carica commenti nella home
        commentiHome.value = dati.commentiHome;
        
        // Carica previsioni orarie
        previsioniOrarieInputs.forEach((input, index) => {
            input.value = dati.previsioniOrarie[index];
        });
    
        // Carica obiettivi turno
        obiettiviTurnoInputs.forEach((input, index) => {
            input.value = dati.obiettiviTurno[index];
        });
    
        // Carica le task
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
    
                    // Aggiungi l'immagine se esiste
                    if (task.image) {
                        const taskImage = document.createElement('img');
                        taskImage.src = task.image;  // Ripristina l'immagine dal JSON
                        taskImage.classList.add('task-img');
                        taskImage.style.width = '50px';
                        taskImage.style.height = 'auto';
                        newTask.appendChild(taskImage);  // Aggiungi l'immagine alla task
    
                        // Aggiungi l'event listener per ingrandire l'immagine
                        taskImage.addEventListener('click', function(event) {
                            event.stopPropagation();
                            modalImage.src = task.image;
                            apriModal(imageModal);  // Mostra l'immagine ingrandita nel modal
                        });
                    }
    
                    aggiungiEventiTask(newTask);
                    taskList.appendChild(newTask);  // Aggiungi la task alla lista
                });
            }
        }
    
        // Carica commenti post turno
        postTurnoCommenti.forEach((commento, index) => {
            commento.value = dati.postTurnoCommenti[index];
        });
    
        // Carica il nome del manager, la data e la shift part
        document.getElementById('manager-name').value = dati.managerName || '';
        document.getElementById('data-turno').value = dati.dataTurno || '';
        document.getElementById('shift-part').value = dati.shiftPart || '';
    
        // Carica lo stato delle checkbox
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = dati.checkboxState[checkbox.id] || false;
        });
    }
    


    // Funzione per mostrare una sezione e nascondere le altre
    function mostraSezione(sezioneId) {
        sezioni.forEach(sezione => {
            sezione.style.display = (sezione.id === sezioneId) ? 'block' : 'none';
        });
    }

    // Funzione per mostrare le componenti di un'area e nascondere le altre
    function mostraComponentiArea(areaId) {
        componentiAree.forEach(area => {
            area.style.display = (area.id === areaId) ? 'block' : 'none';
        });
    }

    // Event listener per il link Home
    homeLink.addEventListener('click', function() {
        mostraSezione('home-sezione');
    });

    // Event listener per il link "Previsioni Orarie"
    previsioniLink.addEventListener('click', function() {
        mostraSezione('previsioni-orarie-sezione');
    });

    // Event listener per il link "Aree di Produzione"
    produzioneLink.addEventListener('click', function() {
        mostraSezione('aree-produzione-sezione');
    });
    
    // Event listener per i pulsanti delle aree
    areaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const areaId = button.getAttribute('data-area');
            const areaElement = document.getElementById(areaId);
    
            // Nascondi tutte le altre aree
            componentiAree.forEach(area => {
                if (area !== areaElement) {
                    area.style.display = 'none';
                }
            });
    
            // Mostra/nascondi l'area cliccata
            if (areaElement.style.display === 'none' || areaElement.style.display === '') {
                areaElement.style.display = 'block';
            } else {
                areaElement.style.display = 'none';
            }
        });
    });

    
    const postTurnoLink = document.getElementById('post-turno-page');
    // Event listener per la pagina Post Turno
    postTurnoLink.addEventListener('click', function() {
        mostraSezione('post-turno-sezione');
    });
  
    // Event listener per Gestione Task
    taskPageLink.addEventListener('click', function() {
        mostraSezione('task-page-sezione');
    });
  
    // Aggiungi task
    addTaskButton.addEventListener('click', function() {
        taskDaAggiungere = taskInput.value;
        if (taskDaAggiungere.trim() !== '') {
            categoriaContainer.style.display = 'block';  // Mostra il selettore della categoria
        } else {
            alert('Inserisci una task valida.');
        }
    });

    // Conferma categoria
    confermaCategoriaButton.addEventListener('click', function() {
        const categoria = categoriaSelect.value;
        const taskList = document.querySelector(`#${categoria} .task-list`);
        const newTask = document.createElement('li');
        newTask.textContent = taskDaAggiungere;
        newTask.classList.add('task', 'task-rossa'); // Task in rosso per default
    
        // Event listener per aprire il modal
        newTask.addEventListener('click', function() {
            currentTask = newTask;  // Memorizza la task corrente
            taskModal.style.display = 'block';  // Mostra il modal
        });
        
        aggiungiEventiTask(newTask);
    
        taskList.appendChild(newTask);
        categoriaContainer.style.display = 'none';  // Nasconde il selettore della categoria
        taskInput.value = '';  // Resetta l'input
    
        // Salva i dati dopo l'aggiunta di una task
        salvaDatiLocali();
    });
    
    // Event listener per modificare la task
    modificaTaskButton.addEventListener('click', function() {
        const nuovoTesto = prompt('Inserisci il nuovo testo per la task:', currentTask.textContent);
        if (nuovoTesto) {
            currentTask.textContent = nuovoTesto;
            taskModal.style.display = 'none';  // Chiude il modal
    
            // Salva i dati dopo la modifica della task
            salvaDatiLocali();
        }
    });
  
    function aggiungiEventiTask(task) {
    // Event listener per aprire il modal
      task.addEventListener('click', function() {
          currentTask = task;  // Memorizza la task corrente
  
          // Controlla lo stato della task (rossa o verde) e mostra/nasconde il pulsante "Completa"
          if (task.classList.contains('task-verde')) {
              scattaFotoButton.style.display = 'none';
              completaTaskButton.style.display = 'none'; // Nasconde il pulsante "Completa" se la task è completata
          } else {
              scattaFotoButton.style.display = 'inline-block';
              completaTaskButton.style.display = 'inline-block'; // Mostra il pulsante "Completa" se la task non è completata
          }
          setCurrentTask(task); 
          taskModal.style.display = 'block';  // Mostra il modal
      });
    }
    
    // Event listener per completare la task
    completaTaskButton.addEventListener('click', function() {
        const commento = prompt('Inserisci un commento per la task completata:');
        if (commento) {
            currentTask.textContent += ` (Completata: ${commento})`;
            currentTask.classList.remove('task-rossa');
            currentTask.classList.add('task-verde');  // Cambia il colore a verde
            completaTaskButton.style.display = 'none'; // Nasconde completa se è verde
            taskModal.style.display = 'none';  // Chiude il modal
    
            // Salva i dati dopo il completamento della task
            salvaDatiLocali();
        }
    });
    
    // Event listener per eliminare la task
    eliminaTaskButton.addEventListener('click', function() {
        if (currentTask) {
            currentTask.remove();  // Rimuovi la task
            taskModal.style.display = 'none';  // Chiude il modal
    
            // Salva i dati dopo l'eliminazione della task
            salvaDatiLocali();
        }
    });
    
    // Funzione di ricerca delle task
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
    
    // Funzione per eliminare tutte le task
    deleteAllButton.addEventListener('click', function() {
        if (confirm('Sei sicuro di voler eliminare tutte le task?')) {
            taskLists.forEach(taskList => {
                taskList.innerHTML = '';  // Elimina tutte le task
            });
    
            // Salva i dati dopo l'eliminazione di tutte le task
            salvaDatiLocali();
        }
    });

    // Funzione per aprire i modali (riutilizza la tua logica esistente)
    function apriModal(modal) {
        modal.style.display = 'block';
    }

    // Funzione per chiudere i modali (riutilizza la tua logica esistente)
    function chiudiModal(modal) {
        modal.style.display = 'none';
    }
    // Event listener per chiudere il modal
    chiudiModalButton.addEventListener('click', function() {
        taskModal.style.display = 'none';  // Chiude il modal senza fare nulla
    });

    // Inizializza mostrando solo la Home
    mostraSezione('home-sezione');
    
    
    const aggiungiRigaButton = document.getElementById('aggiungi-riga');
    const tabellaPicchi = document.getElementById('tabella-obiettivi').getElementsByTagName('tbody')[0];

    // Funzione per aggiungere una nuova riga
    aggiungiRigaButton.addEventListener('click', function() {
        const nuovaRiga = document.createElement('tr');
        // Crea le celle per la nuova riga
        const titleobjCell = document.createElement('td');
        const trendCell = document.createElement('td');
        const objCell = document.createElement('td');
        const realCell = document.createElement('td');
        nuovaRiga.classList.add('riga-aggiunta');

        // Inserisci input nelle celle
        titleobjCell.innerHTML = '<input type="text" maxlength="20" placeholder="Inserisci testo...">';
        trendCell.innerHTML = '<textarea rows="2" placeholder="Inserisci commento..."></textarea>';
        objCell.innerHTML = '<textarea rows="2" placeholder="Inserisci commento..."></textarea>';
        realCell.innerHTML = '<textarea rows="2" placeholder="Inserisci commento..."></textarea>';

        // Aggiungi le celle alla riga
        nuovaRiga.appendChild(titleobjCell);
        nuovaRiga.appendChild(trendCell);
        nuovaRiga.appendChild(objCell);
        nuovaRiga.appendChild(realCell);

        // Aggiungi la riga alla tabella
        tabellaPicchi.appendChild(nuovaRiga);
    });
    // Carica i dati dal localStorage all'avvio
    function caricaDatiLocali() {
        const datiSalvati = JSON.parse(localStorage.getItem('appData')) || {};

        // Carica il nome del manager, la data e la shift part
        if (datiSalvati.managerName) {
            managerNameInput.value = datiSalvati.managerName;
        }
        if (datiSalvati.dataTurno) {
            dataTurnoInput.value = datiSalvati.dataTurno;
        }
        if (datiSalvati.shiftPart) {
            shiftPartInput.value = datiSalvati.shiftPart;
        }

        // Carica lo stato delle checkbox
        if (datiSalvati.checkboxState) {
            checkboxInputs.forEach(checkbox => {
                if (datiSalvati.checkboxState[checkbox.id] !== undefined) {
                    checkbox.checked = datiSalvati.checkboxState[checkbox.id];
                }
            });
        }

        // Carica commenti nella home
        if (datiSalvati.commentiHome) {
            commentiHome.value = datiSalvati.commentiHome;
        }

        // Carica previsioni orarie
        if (datiSalvati.previsioniOrarie) {
            previsioniOrarieInputs.forEach((input, index) => {
                input.value = datiSalvati.previsioniOrarie[index] || '';
            });
        }

        // Carica obiettivi turno
        if (datiSalvati.obiettiviTurno) {
            obiettiviTurnoInputs.forEach((input, index) => {
                input.value = datiSalvati.obiettiviTurno[index] || '';
            });
        }

        // Carica le task salvate per categoria
        if (datiSalvati.taskData) {
            for (const categoria in datiSalvati.taskData) {
                const taskList = document.querySelector(`#${categoria} .task-list`); // Seleziona la lista task della categoria
                datiSalvati.taskData[categoria].forEach(task => {
                    const newTask = document.createElement('li');
                    newTask.textContent = task.text;
                    newTask.classList.add('task'); // Aggiungi la classe task
                    if (task.completed) {
                        newTask.classList.add('task-verde'); // Aggiungi la classe task-verde se è completata
                    } else {
                        newTask.classList.add('task-rossa'); // Aggiungi la classe task-rossa se non è completata
                    }

                    // Aggiungi l'immagine se esiste
                    if (task.image) {
                        const taskImage = document.createElement('img');
                        taskImage.src = task.image;  // Imposta la sorgente dell'immagine
                        taskImage.classList.add('task-img');
                        taskImage.style.width = '50px';
                        taskImage.style.height = 'auto';
                        newTask.appendChild(taskImage);  // Aggiungi l'immagine alla task

                        // Aggiungi l'event listener per ingrandire l'immagine al click
                        taskImage.addEventListener('click', function(event) {
                            event.stopPropagation();
                            modalImage.src = task.image;
                            apriModal(imageModal);
                        });
                    }
                  
                    // Aggiungi gli event listener alla task caricata
                    aggiungiEventiTask(newTask);

                    // Aggiungi la task alla lista
                    taskList.appendChild(newTask);
                });
            }
        }

        // Carica commenti post turno
        if (datiSalvati.postTurnoCommenti) {
            postTurnoCommenti.forEach((commento, index) => {
                commento.value = datiSalvati.postTurnoCommenti[index] || '';
            });
        }
    }

    // Funzione per salvare i dati nel localStorage
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
        
        // Salva lo stato delle checkbox
        checkboxInputs.forEach(checkbox => {
            datiDaSalvare.checkboxState[checkbox.id] = checkbox.checked;
        });
      
        taskLists.forEach(taskList => {
            const categoria = taskList.parentNode.id;
            const tasks = [];
            taskList.querySelectorAll('li').forEach(task => {
                const taskImage = task.querySelector('img.task-img');  // Recupera l'immagine se presente
                tasks.push({
                    text: task.firstChild.textContent,  // Salva il testo della task
                    completed: task.classList.contains('task-verde'),  // Controlla se la task è completata
                    image: taskImage ? taskImage.src : null  // Salva l'immagine se presente
                });
            });
            datiDaSalvare.taskData[categoria] = tasks;
        });
        localStorage.setItem('appData', JSON.stringify(datiDaSalvare));
    }

    // Event listener per aggiornare automaticamente i dati salvati in localStorage
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

    // Carica i dati quando la pagina viene caricata
    caricaDatiLocali();
  
    // Funzione per calcolare le stime e i picchi
    function calcolaStime(gcS, mfy, instore, drive, delivery, patate, bevcell, stimaIds, piccoIds, gcSPicchi, mfyPicchi, instorePicchi, drivePicchi, deliveryPicchi) {
        // Calcolo delle stime
        const stimaMfy = parseInt(Math.round(gcS * mfy)); // MFY
        const stimaInstore = parseInt(Math.round((gcS * instore)/100)); // Instore
        const stimaDrive = parseInt(Math.round((gcS * drive)/100)); // Drive
        const stimaDelivery = parseInt(Math.round((gcS * delivery)/100)); // Delivery
        const stimaPatate = parseInt(Math.round(gcS * patate)); // Patate
        const stimaBevcell = parseInt(Math.round(gcS * bevcell)); // BevCell

        // Inserisci le stime nei campi appositi
        document.getElementById(stimaIds[1]).value = stimaMfy;
        document.getElementById(stimaIds[2]).value = stimaInstore;
        document.getElementById(stimaIds[3]).value = stimaDrive;
        document.getElementById(stimaIds[4]).value = stimaDelivery;
        document.getElementById(stimaIds[5]).value = stimaPatate;
        document.getElementById(stimaIds[6]).value = stimaBevcell;

        // Calcolo dei picchi basati sulle stime calcolate e gli input dell'utente
        const piccoGcS = parseInt(Math.round((gcS * gcSPicchi)/100)); // Picco per GcS
        const piccoMfy = parseInt(Math.round((stimaMfy * mfyPicchi)/100)); // Picco per MFY
        const piccoInstore = parseInt(Math.round((stimaInstore * instorePicchi)/100)); // Picco per Instore
        const piccoDrive = parseInt(Math.round((stimaDrive * drivePicchi)/100)); // Picco per Drive
        const piccoDelivery = parseInt(Math.round((stimaDelivery * deliveryPicchi)/100)); // Picco per Delivery

        // Inserisci i picchi nei campi appositi
        document.getElementById(piccoIds[0]).value = piccoGcS;
        document.getElementById(piccoIds[1]).value = piccoMfy;
        document.getElementById(piccoIds[2]).value = piccoInstore;
        document.getElementById(piccoIds[3]).value = piccoDrive;
        document.getElementById(piccoIds[4]).value = piccoDelivery;

        // Salva i dati localmente
        salvaDatiLocali();
    }


    // Event listener per il pulsante Calcola della prima fascia oraria
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

        // Calcolo delle stime per la prima fascia oraria
        calcolaStime(gcS, mfy, instore, drive, delivery, patate, bevcell, [
            'gcs-stima-1', 'mfy-stima-1', 'inst-stima-1', 'auto-stima-1', 'mcdel-stima-1', 'patate-stima-1', 'bevcell-stima-1'
        ], ['gcs-picco-1', 'mfy-picco-1', 'inst-picco-1', 'auto-picco-1', 'mcdel-picco-1'], gcSPicchi, mfyPicchi, instorePicchi, drivePicchi, deliveryPicchi);
    });

    // Event listener per il pulsante Calcola della seconda fascia oraria
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

        // Calcolo delle stime per la prima fascia oraria
        calcolaStime(gcS, mfy, instore, drive, delivery, patate, bevcell, [
            'gcs-stima-2', 'mfy-stima-2', 'inst-stima-2', 'auto-stima-2', 'mcdel-stima-2', 'patate-stima-2', 'bevcell-stima-2'
        ], ['gcs-picco-2', 'mfy-picco-2', 'inst-picco-2', 'auto-picco-2', 'mcdel-picco-2'], gcSPicchi, mfyPicchi, instorePicchi, drivePicchi, deliveryPicchi);
    });

    // Event listener per il pulsante Calcola della terza fascia oraria
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

        // Calcolo delle stime per la prima fascia oraria
        calcolaStime(gcS, mfy, instore, drive, delivery, patate, bevcell, [
            'gcs-stima-3', 'mfy-stima-3', 'inst-stima-3', 'auto-stima-3', 'mcdel-stima-3', 'patate-stima-3', 'bevcell-stima-3'
        ], ['gcs-picco-3', 'mfy-picco-3', 'inst-picco-3', 'auto-picco-3', 'mcdel-picco-3'], gcSPicchi, mfyPicchi, instorePicchi, drivePicchi, deliveryPicchi);
    });
  
    // Recupera la preferenza del tema dal localStorage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').checked = true;
    }
    
    // Gestisce il toggle della modalità scura
    document.getElementById('theme-toggle').addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });
  
     // Event listener per scattare o caricare una foto
     scattaFotoButton.addEventListener('click', function() {
        taskImageInput.click();  // Simula il click sull'input file
    });

    // Aggiungi l'event listener per gestire il caricamento dell'immagine una sola volta
    taskImageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];  // Prendi il file selezionato
        if (file && currentTask) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Controlla se l'immagine esiste già, altrimenti creala
                let taskImage = currentTask.querySelector('img.task-img');
                if (!taskImage) {
                    taskImage = document.createElement('img');
                    taskImage.classList.add('task-img');
                    taskImage.style.width = '50px';
                    taskImage.style.height = 'auto';
                    currentTask.appendChild(taskImage);  // Aggiungi l'immagine alla task
                }

                // Imposta la sorgente dell'immagine e mostra l'immagine
                taskImage.src = e.target.result;
                taskImage.style.display = 'inline';  // Mostra l'immagine

                // Aggiungi un event listener per ingrandire l'immagine al click
                taskImage.addEventListener('click', function(event) {
                    event.stopPropagation();
                    modalImage.src = e.target.result;
                    apriModal(imageModal);  // Mostra l'immagine ingrandita nel modal
                });

                // Salva i dati dopo aver aggiunto l'immagine
                salvaDatiLocali();
            };
            reader.readAsDataURL(file);  // Leggi il file come base64
        }
    });

    // Funzione per associare una task corrente prima di cliccare su "Scatta Foto"
    function setCurrentTask(taskElement) {
        currentTask = taskElement;  // Imposta la task corrente
    }
    

    // Event listener per chiudere il modal
    chiudiModalButton.addEventListener('click', function() {
        taskModal.style.display = 'none';  // Chiudi il modal
    });

    // Event listener per chiudere il modal dell'immagine
    chiudiImmagine.addEventListener('click', function() {
        chiudiModal(imageModal);  
    });

    // Chiudi il modal se si clicca fuori dall'immagine
    window.addEventListener('click', function(event) {
        if (event.target === imageModal) {
            chiudiModal(imageModal); 
        }
    });

    /////////// SALVA PDF
    //document.getElementById('commenti-analisi')   // Commenti e analisi
    //document.getElementById('previsioni-orarie')  // Previsioni orarie
    //document.getElementById('obiettivi-turno')    // Obiettivi del turno
    //document.getElementById('post-turno-page')    // Commenti post-turno

    //document.querySelectorAll('input[type="checkbox"]')  // Tutte le checklist del turno

    //document.querySelectorAll('.previsioni-input')  // Input delle previsioni
    //document.querySelectorAll('.obiettivi-input')   // Input degli obiettivi
    //document.querySelectorAll('.post-turno-commenti')  // Commenti di fine turno

    //document.getElementById('task-input')          // Input per inserire una task
    //document.getElementById('add-task')            // Pulsante per aggiungere una task
    //document.getElementById('categoria-select')    // Selettore della categoria task
    //document.getElementById('search-task')         // Ricerca delle task
    //document.getElementById('delete-all-tasks')    // Pulsante per eliminare tutte le task

    //const checklistText = document.querySelectorAll('input[type="checkbox"]').value;
    //const checklistItems = checklistText.split("\n"); // Divide il contenuto per ogni riga
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
        // Carica il file PDF template originale
        const pdfUrl = 'check-list.pdf'; // Assicurati che sia accessibile
        const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
    
        // Carica il PDF con PDF-Lib
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();
    
        // Recupera i dati dai campi dell'app
        const managerName = document.getElementById('manager-name').value || "N/D";
        const shiftDate = document.getElementById('data-turno').value || "N/D";
        const shiftPart = document.getElementById('shift-part').value || "N/D";

        // Trova i campi del PDF (usa il nome corretto dei campi nel template PDF)
        form.getTextField('manager').setText(managerName);
        form.getTextField('data').setText(shiftDate);
        form.getTextField('daypart').setText(shiftPart);

        checkboxMapping.forEach(({ htmlId, pdfField }) => {
            const checkbox = document.getElementById(htmlId);
            if (checkbox && checkbox.checked) {
                form.getCheckBox(pdfField).check();  // Spunta il checkbox nel PDF
            }
        });

        timeMapping.forEach(({ htmlId, pdfField }) => {
            const timeInput = document.getElementById(htmlId);
            if (timeInput) {
                form.getTextField(pdfField).setText(timeInput.value || "N/A");
            }
        });

        const tableRows = document.querySelectorAll('#tabella-obiettivi tr:not(:first-child)');
        const maxRows = 9;

        tableRows.forEach((row, index) => {
            if (index < maxRows) { // Se abbiamo più righe del previsto, prendiamo solo le prime 10
                const cells = row.querySelectorAll('td');
    
                // Controlla se la cella contiene un input o una textarea e recupera il valore
                const titolo = cells[0].querySelector('input') ? cells[0].querySelector('input').value : cells[0].innerText;
                const trend = cells[1].querySelector('textarea') ? cells[1].querySelector('textarea').value : cells[1].innerText;
                const obj = cells[2].querySelector('textarea') ? cells[2].querySelector('textarea').value : cells[2].innerText;
                const real = cells[3].querySelector('textarea') ? cells[3].querySelector('textarea').value : cells[3].innerText;
    
                // Nome dei campi nel PDF (es. "Obiettivo_1_Titolo", "Obiettivo_1_Trend", etc.)
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
    
            // Se il campo esiste nel PDF, lo riempiamo con le task
            if (form.getTextField(pdfField)) {
                form.getTextField(pdfField).setText(taskText || "Nessuna Task Presente");
            }
        });

        postTurnoFields.forEach(({ htmlId, pdfField }) => {
            const commentBox = document.getElementById(htmlId);
            const commentText = commentBox ? commentBox.value.trim() : "Nessun commento";
    
            // Se il campo esiste nel PDF, lo riempiamo con il testo
            if (form.getTextField(pdfField)) {
                form.getTextField(pdfField).setText(commentText);
            }
        });
    
        // Salva il nuovo PDF compilato
        const pdfBytes = await pdfDoc.save();
    
        // Crea il blob per il download
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
    
        // Crea e clicca automaticamente un link per scaricare il PDF
        const a = document.createElement('a');
        a.href = url;
        a.download = `Checklist_Turno_${shiftDate}.pdf`;
        a.click();
    });
    
    document.getElementById('generate-pdf').addEventListener('click', async function () {
        
            const tasks = document.querySelectorAll('.task-item');
            console.log("Elenco delle Task:");
        
            tasks.forEach((task, index) => {
                const testo = task.querySelector('.task-text') ? task.querySelector('.task-text').innerText : "N/A";
                console.log(`${index + 1}. Task: ${testo}`);
            });
        
    });

});
