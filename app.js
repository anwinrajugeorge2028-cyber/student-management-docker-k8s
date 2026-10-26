const STORAGE_KEY = "student-manager-records-v1";
const starterStudents = [
  {key:"1",name:"Aarav Nair",studentId:"STU-1001",course:"BCA",email:"aarav@example.com",status:"Active"},
  {key:"2",name:"Diya Thomas",studentId:"STU-1002",course:"B.Com",email:"diya@example.com",status:"Active"},
  {key:"3",name:"Noah Mathew",studentId:"STU-1003",course:"B.Sc Computer Science",email:"noah@example.com",status:"Inactive"}
];
const $ = id => document.getElementById(id);
const dialog = $("studentDialog");
let students = loadStudents();

function loadStudents(){
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? [...starterStudents] : JSON.parse(saved);
  } catch { return [...starterStudents]; }
}
function saveStudents(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(students)); }
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function render(){
  const query = $("searchInput").value.trim().toLowerCase();
  const filtered = students.filter(s => [s.name,s.studentId,s.course,s.email,s.status].some(v => v.toLowerCase().includes(query)));
  $("totalCount").textContent = students.length;
  $("activeCount").textContent = students.filter(s=>s.status==="Active").length;
  $("inactiveCount").textContent = students.filter(s=>s.status==="Inactive").length;
  $("recordCount").textContent = `${filtered.length} of ${students.length} records`;
  $("emptyState").hidden = filtered.length !== 0;
  $("studentRows").innerHTML = filtered.map(s => `
    <tr>
      <td><span class="student-avatar">${escapeHtml(s.name.trim().split(/\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase())}</span>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.studentId)}</td><td>${escapeHtml(s.course)}</td><td>${escapeHtml(s.email)}</td>
      <td><span class="badge ${s.status==="Active"?"active":"inactive"}">${escapeHtml(s.status)}</span></td>
      <td><div class="actions"><button class="small-button" data-edit="${escapeHtml(s.key)}">Edit</button><button class="small-button delete" data-delete="${escapeHtml(s.key)}">Delete</button></div></td>
    </tr>`).join("");
}
function openAdd(){
  $("studentForm").reset(); $("studentKey").value=""; $("dialogTitle").textContent="Add student"; $("formError").textContent="";
  dialog.showModal(); $("name").focus();
}
function openEdit(key){
  const s=students.find(x=>x.key===key); if(!s)return;
  $("studentKey").value=s.key; $("name").value=s.name; $("studentId").value=s.studentId; $("course").value=s.course; $("email").value=s.email; $("status").value=s.status;
  $("dialogTitle").textContent="Edit student"; $("formError").textContent=""; dialog.showModal();
}
$("addStudentBtn").addEventListener("click",openAdd);
$("closeDialog").addEventListener("click",()=>dialog.close());
$("cancelBtn").addEventListener("click",()=>dialog.close());
$("searchInput").addEventListener("input",render);
$("studentRows").addEventListener("click",event=>{
  const edit=event.target.closest("[data-edit]"); const del=event.target.closest("[data-delete]");
  if(edit) openEdit(edit.dataset.edit);
  if(del){
    const s=students.find(x=>x.key===del.dataset.delete);
    if(s && confirm(`Delete ${s.name}'s record?`)){students=students.filter(x=>x.key!==s.key);saveStudents();render();}
  }
});
$("studentForm").addEventListener("submit",event=>{
  event.preventDefault();
  const key=$("studentKey").value;
  const record={key:key||String(Date.now()),name:$("name").value.trim(),studentId:$("studentId").value.trim(),course:$("course").value.trim(),email:$("email").value.trim(),status:$("status").value};
  if(students.some(s=>s.studentId.toLowerCase()===record.studentId.toLowerCase() && s.key!==key)){
    $("formError").textContent="That student ID already exists. Please use a unique ID."; return;
  }
  if(key) students=students.map(s=>s.key===key?record:s); else students.unshift(record);
  saveStudents();render();dialog.close();
});
$("resetDemoBtn").addEventListener("click",()=>{
  if(confirm("Replace your current records with the original demo data?")){students=[...starterStudents];saveStudents();render();}
});
render();
