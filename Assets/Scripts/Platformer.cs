using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using FMODUnity;
//using UnityEngine.Audio;

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

    //public AudioMixerSnapshot normalG;

    //public float colorTransitionSpeed;
    //Color backgroundColorG;
    //Color platformColorG;
    //Color playerColorG;
    //float colorTransitionCounter;

    //bool comingFromLeft;

    public float musicTransitionTime;
    public float newTrackSampleTime;

    [SerializeField]
    [ParamRef]
    private string timeSignatureParam = null;

    //AudioMixerSnapshot currentSnapshot;

    // Start is called before the first frame update
    void Start()
    {
        //currentSnapshot = normal;
        speed = normalSpeed;
        isFrozen = false;
        rb = GetComponent<Rigidbody2D>();
        //playerRenderer = GetComponent<SpriteShapeRenderer>();
        //ColorUtility.TryParseHtmlString("#F0EDE3", out backgroundColorG);
        //ColorUtility.TryParseHtmlString("#424660", out platformColorG);
        //ColorUtility.TryParseHtmlString("#B4935D", out playerColorG);
        //colorTransitionCounter = 1.0f;
        //comingFromLeft = true;
    }

    // Update is called once per frame
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

        //if (colorTransitionCounter < 1.0f)
        //{
        //    if (comingFromLeft)
        //    {
        //        platform.color = Color.Lerp(Color.black, platformColorG, colorTransitionCounter);
        //        background.color = Color.Lerp(Color.white, backgroundColorG, colorTransitionCounter);
        //        playerRenderer.color = Color.Lerp(Color.black, playerColorG, colorTransitionCounter);
        //    }
        //    else
        //    {
        //        platform.color = Color.Lerp(platformColorG, Color.black, colorTransitionCounter);
        //        background.color = Color.Lerp(backgroundColorG, Color.white, colorTransitionCounter);
        //        playerRenderer.color = Color.Lerp(playerColorG, Color.black, colorTransitionCounter);
        //    }

        //    colorTransitionCounter += Time.deltaTime * colorTransitionSpeed;

        //    if (colorTransitionCounter >= 1.0f)
        //    {
        //        comingFromLeft = !comingFromLeft;
        //    }
        //}
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
            //if (currentSnapshot != fast)
            //{
                //fast.TransitionTo(musicTransitionTime);
                //currentSnapshot = fast;
                speed = fastSpeed;
                rb.gravityScale = 1.0f;
            //}
        }
        else if (collision.CompareTag("SlowBackground"))
        {
            //if (currentSnapshot != slow)
            //{
                //slow.TransitionTo(musicTransitionTime);
                //currentSnapshot = slow;
                speed = slowSpeed;
                rb.gravityScale = 1.0f;
            //}
        }
        else if (collision.CompareTag("HighBackground"))
        {
            //if (currentSnapshot != high)
            //{
                //high.TransitionTo(musicTransitionTime);
                //currentSnapshot = high;
                speed = normalSpeed;
                rb.gravityScale = 0.5f;
            //}
        }
        else if (collision.CompareTag("LowBackground"))
        {
            //if (currentSnapshot != low)
            //{
            //    low.TransitionTo(musicTransitionTime);
            //    currentSnapshot = low;
                speed = normalSpeed;
                rb.gravityScale = 2.0f;
            //}
        }
        //else if (collision.CompareTag("Jukebox"))
        //{
            //if (currentSnapshot == normal)
            //{
            //    normalG.TransitionTo(musicTransitionTime);
            //    currentSnapshot = normalG;
            //}
            //else if (currentSnapshot == normalG)
            //{
            //    normal.TransitionTo(musicTransitionTime);
            //    currentSnapshot = normal;
            //}

        //    colorTransitionCounter = 0.0f;
        //}
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
            //normal.TransitionTo(musicTransitionTime);
            //currentSnapshot = normal;
            speed = normalSpeed;
            rb.gravityScale = 1.0f;
        }
    }

    private void SetTimeSignature(float timeSignature)
    {
        RuntimeManager.StudioSystem.setParameterByName(timeSignatureParam, timeSignature);
    }

    IEnumerator PlayNewTrack()
    {
        isFrozen = true;
        //normalG.TransitionTo(musicTransitionTime);
        yield return new WaitForSeconds(newTrackSampleTime);
        //currentSnapshot.TransitionTo(musicTransitionTime);
        isFrozen = false;
    }
}
