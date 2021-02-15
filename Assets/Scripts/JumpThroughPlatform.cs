using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class JumpThroughPlatform : MonoBehaviour
{
    BoxCollider2D collider;

    bool isSpaceDown;

    private void Start()
    {
        collider = GetComponent<BoxCollider2D>();
        collider.isTrigger = false;
    }

    // Update is called once per frame
    void Update()
    {
        if (!isSpaceDown)
        {
            isSpaceDown = Input.GetKeyDown(KeyCode.Space);
        }
    }

    private void FixedUpdate()
    {
        if (isSpaceDown)
        {
            isSpaceDown = false;
            collider.isTrigger = true;
            StartCoroutine("EnableCollider");
        }
    }

    IEnumerator EnableCollider()
    {
        yield return new WaitForSeconds(0.5f);
        collider.isTrigger = false;
    }
}
