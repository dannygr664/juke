using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NoteAnimator : MonoBehaviour
{
    private Animator animator;

    private void Awake()
    {
        animator = GetComponent<Animator>();
    }

    private void Update()
    {
        MusicManager.beatUpdated += Dance;
    }

    private void OnDestroy()
    {
        MusicManager.beatUpdated -= Dance;
    }

    private void Dance()
    {
        animator.Play("Dancing_Right");
    }
}
