fetch(`/settings/dev/${repoName}`).then(res => res.json()).then(d => {
    if (d.length == 0) document.getElementById('settingsLoading').innerHTML = 'No settings were loaded because the cloned repo does not exist'
})
