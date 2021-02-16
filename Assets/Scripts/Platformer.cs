using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using FMODUnity;

public class Platformer : MonoBehaviour
{
    public float normalSpeed;
    public float fastSpeed;
    public float slowSpeed;
    float speed;
    public float jumpForce;

    bool isFrozen;

    float horizontal;
    bool isSpaceDown;

    Rigidbody2D rb;
    Transform trans;

    [SerializeField]
    private Vector3 scaleChange;

    Animator animator;

    bool isGrounded = false;
    public Transform isGroundedChecker;
    public float checkGroundRadius;
    public LayerMask groundLayer;

    public float fallMultiplier = 2.5f;
    public float lowJumpMultiplier = 2f;

    public float rememberGroundedFor;
    float lastTimeGrounded;

    public int defaultAdditionalJumps = 1;
    int additionalJumps;

    public float musicTransitionTime;
    public float newTrackSampleTime;

    private void Awake()
    {
        speed = normalSpeed;
        isFrozen = false;
        rb = GetComponent<Rigidbody2D>();
        trans = GetComponent<Transform>();
        animator = GetComponent<Animator>();
        MusicManager.beatUpdated += Pulse;
    }

    void Update()
    {
        horizontal = Input.GetAxisRaw("Horizontal");

        if (!isSpaceDown)
        {
            isSpaceDown = Input.GetKeyDown(KeyCode.Space);
        }

        if (!isFrozen)
        {
            CheckIfGrounded();
        }
    }

    private void FixedUpdate()
    {
        if (!isFrozen)
        {
            Move();
            Jump();
            BetterJump();
        }
        isSpaceDown = false;
    }

    private void OnDestroy()
    {
        MusicManager.beatUpdated -= Pulse;
    }

    void Move()
    {
        float moveBy = horizontal * speed;
        rb.velocity = new Vector2(moveBy, rb.velocity.y);
    }

    void Jump()
    {
        if (isSpaceDown && (isGrounded || Time.time - lastTimeGrounded <= rememberGroundedFor || additionalJumps > 0))
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpForce);
            additionalJumps--;
        }
    }

    void BetterJump()
    {
        if (rb.velocity.y < 0)
        {
            rb.velocity += Vector2.up * Physics2D.gravity * (fallMultiplier - 1) * Time.deltaTime;
        }
        else if (rb.velocity.y > 0 && !Input.GetKey(KeyCode.Space))
        {
            rb.velocity += Vector2.up * Physics2D.gravity * (lowJumpMultiplier - 1) * Time.deltaTime;
        }
    }

    void CheckIfGrounded()
    {
        Collider2D collider = Physics2D.OverlapCircle(isGroundedChecker.position, checkGroundRadius, groundLayer);
        if (collider != null)
        {
            isGrounded = true;
            additionalJumps = defaultAdditionalJumps;
        }
        else
        {
            if (isGrounded)
            {
                lastTimeGrounded = Time.time;
            }
            isGrounded = false;
        }
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.CompareTag("FastBackground"))
        {
            speed = fastSpeed;
            rb.gravityScale = 1.0f;
        }
        else if (collision.CompareTag("SlowBackground"))
        {
            speed = slowSpeed;
            rb.gravityScale = 1.0f;
        }
        else if (collision.CompareTag("HighBackground"))
        {
            speed = normalSpeed;
            rb.gravityScale = 0.5f;
        }
        else if (collision.CompareTag("LowBackground"))
        {
            speed = normalSpeed;
            rb.gravityScale = 2.0f;
        }
        else if (collision.CompareTag("4-4Background"))
        {
            MusicManager.instance.UpdateTimeSignature(0);
        }
        else if (collision.CompareTag("3-4Background"))
        {
            MusicManager.instance.UpdateTimeSignature(1);
        }
        else if (collision.CompareTag("2-4Background"))
        {
            MusicManager.instance.UpdateTimeSignature(2);
        }
    }

    private void OnTriggerExit2D(Collider2D collision)
    {
        if (collision.CompareTag("FastBackground") || collision.CompareTag("SlowBackground") || collision.CompareTag("HighBackground") || collision.CompareTag("LowBackground"))  //&& currentSnapshot != normal)
        {
            speed = normalSpeed;
            rb.gravityScale = 1.0f;
        }
    }

    private void Pulse()
    {
        animator.Play("Player_Pulsing");
    }
}
