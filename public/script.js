document.addEventListener('DOMContentLoaded', () => {
  const roleSelect = document.getElementById('roleSelect');
  const organogramDiv = document.getElementById('organogram');
  const loadingSpinner = document.getElementById('loading');

  fetch('http://localhost:8001/role/all')
    .then((res) => res.json())
    .then((roles) => {
      roles.data.forEach((role) => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        roleSelect.appendChild(option);
      });
    });

  // Event listener for dropdown
  roleSelect.addEventListener('change', async () => {
    const roleId = roleSelect.value;
    organogramDiv.innerHTML = '';
    if (!roleId) return;

    loadingSpinner.style.display = 'block';

    try {
      const response = await fetch(`http://localhost:8001/employee/${roleId}`);
      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        organogramDiv.innerHTML = `<div class="alert alert-warning">No Sub Roles found for this role.</div>`;
        return;
      }

      renderTree(data.data, organogramDiv);
    } catch (err) {
      organogramDiv.innerHTML = `<div class="alert alert-danger">Error fetching organogram.</div>`;
    } finally {
      loadingSpinner.style.display = 'none';
    }
  });

  // Recursive function to render the tree
  function renderTree(nodes, container) {
    nodes.forEach((node) => {
      const nodeDiv = document.createElement('div');
      nodeDiv.className = 'node';

      const title = document.createElement('div');
      title.innerHTML = `<strong>${node.name}</strong>`;
      nodeDiv.appendChild(title);

      if (node.employees?.length) {
        const empList = document.createElement('div');
        empList.className = 'employee-list';
        node.employees.forEach((emp) => {
          const empItem = document.createElement('div');
          empItem.className = 'employee-item';
          empItem.textContent = `${emp.name} (Joined: ${new Date(emp.joined_at).toLocaleDateString()})`;
          empList.appendChild(empItem);
        });
        nodeDiv.appendChild(empList);
      }

      if (node.children?.length) {
        renderTree(node.children, nodeDiv);
      }

      container.appendChild(nodeDiv);
    });
  }
});
