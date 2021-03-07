using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class JumpThroughPlatform : MonoBehaviour
{
    BoxCollider2D platformCollider;

    bool isSpaceDown;

    private void Start()
    {
        platformCollider = GetComponent<BoxCollider2D>();
        platformCollider.isTrigger = false;
    }

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
            platformCollider.isTrigger = true;
            StartCoroutine("EnableCollider");
        }
    }

    IEnumerator EnableCollider()
    {
        yield return new WaitForSeconds(0.5f);
        platformCollider.isTrigger = false;
    }
}
